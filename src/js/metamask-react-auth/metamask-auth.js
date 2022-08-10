import {
  ethers
} from 'ethers';
import axios from 'axios'
console.log('window.ethereum: ',window.ethereum)
let provider = null
if (window.ethereum)provider = new ethers.providers.Web3Provider(window.ethereum);

const initListeners = async (ethereum)=>{
  const valid_ethereum = Boolean(ethereum)
  console.log('initListeners: ',valid_ethereum)
  if (ethereum){
    ethereum.removeListener('accountsChanged',accountChangeListener)
    ethereum.on('accountsChanged', accountChangeListener)
    ethereum.on('chainChanged', function (networkId) {
      // Time to reload your interface with the new networkId
    // console.log('chainChanged: ',networkId)
    })
  }
}

const accountChangeListener = async (accounts)=>{
   // Time to reload your interface with accounts[0]!
  //  console.log('in accountChangeListener')
  // console.log('accountChangeListener: ',accounts)
  if (!accounts){
    console.log('in accountChangeListener: no account connected')
    return
  }
  if (!accounts.length){
    console.log('in accountChangeListener: no account connected')
    return
  }
  const userAddress = accounts[0]
   console.log('accountsChanged: ', userAddress)
   const validSession = checkSession(userAddress)
   console.log('validSession: ',validSession)

  //  if (!validSession) {
  //    console.log('initiate loginRequest from account change')
  //    await loginRequest(userAddress)
  //  }
}

// initListeners()

const axios_call = async (payload)=> {
  return await axios(payload)
      .then((response) => {
          return response;
      })
      .catch((error) => {
          console.log(error);
          return null;
      });
}

const globals = {
  'local':'http://127.0.0.1:3002',
  'remote':'https://api.imma.club',
}

const server = 'remote'
async function signLogin(address,results) {
  try {
    const domain = results.domain
    const types = results.types
    const voucher = results.voucher
    const signer = provider.getSigner(address)
    const signature = await signer._signTypedData(domain, types, voucher)
    // const recoveredAddress = ethers.utils.verifyTypedData(domain, types, voucher, signature);
    const response = {
      voucher,
      signature,
    }
  return response
  } catch (error) {
    console.log(error)
  }
}

async function loginConfirm(login_response) {
  try {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('signature', login_response.signature);
    data.append('voucher', JSON.stringify(login_response.voucher));
    var config = {
      method: 'post',
      url: `${globals[server]}/api/ethereum/rinkeby/loginConfirm`,
      headers: {},
      data : data
    };
    const axios_response = await axios_call(config)
    return axios_response

  } catch (error) {
    console.log()
  }
}

async function loginRequest(address) {
  try {
    var FormData = require('form-data');
    var data = new FormData();
    data.append('address', address);
    var config = {
      method: 'post',
      url: `${globals[server]}/api/ethereum/rinkeby/loginRequest`,
      headers: {},
      data : data
    };
    const loginRequestResponse = await axios_call(config)
    if (!loginRequestResponse.data){
      console.log('server not ready')
      return
    }
    const loginRequestResults = loginRequestResponse.data.results
    if (!loginRequestResults){
      console.log('server results not found')
      return
    }
    const metaMaskSignature = await signLogin(address,loginRequestResults)
    if (!metaMaskSignature){
      console.log('signature failed')
      return
    }
    const loginConfirmResponse = await loginConfirm(metaMaskSignature)
    if (loginConfirmResponse.status ===200) {
      const confirm_results = loginConfirmResponse.data.results
      if (!confirm_results) {
        console.log('confirm reuslts empty')
        return
      }
      const address = confirm_results.address
      // const session = confirm_results.session
      // const expire = loginRequestResults.voucher.expire
      const payload = JSON.stringify(confirm_results)
      sessionStorage.setItem(address,payload)
      // console.log('loginConfirmResponse: ',loginConfirmResponse)
      // localStorage.setItem()
      return true
    }
    // console.log('loginConfirmResponse: ',loginConfirmResponse)

  } catch (error) {
    console.log(error)
  }
}

function isMobileDevice() {
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

async function connect(onConnected) {
  if (!window.ethereum) {
    /* alert("Get MetaMask!")*/;
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  onConnected(accounts[0]);
}

async function checkIfWalletIsConnected(onConnected) {
  const mobileDevice =  isMobileDevice()
  console.log('mobileDevice: ',mobileDevice)
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      const account = accounts[0];
      onConnected(account);
      return;
    }

    if (isMobileDevice()) {
      console.log('this is a mobile device')
      await connect(onConnected);
    }else{
      console.log('this is not a mobile device')
    }
  }
}

const isExpire = (expire)=>{
  try {
    const date_expire = new Date(expire*1000)
    const date_now = new Date()
    const expired = date_expire.getTime() < date_now.getTime()
    return expired
  } catch (error) {
    console.log(error)
  }
}

const checkSession = (userAddress)=>{
  try {
    const session_data = sessionStorage.getItem(userAddress);
    if (session_data){
      const session_data_parsed = JSON.parse(session_data)
      if (isExpire(session_data_parsed.expire)){
        console.log('session expire')
        return
      }
      return true
    }else{
      console.log('session data missing')
    }

  } catch (error) {
    console.log(error)
  }
}
export {
  loginRequest,
  checkIfWalletIsConnected,
  checkSession,
  isMobileDevice,
  connect,
  accountChangeListener,
  initListeners

}

const axios_call = async (payload) => {
  return await axios(payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}
async function signLogin(signer, results) {
  try {
    const domain = results.domain
    const types = results.types
    const voucher = results.voucher

    const chainId = await signer.getChainId()
    const signature = await signer._signTypedData(domain, types, voucher)
    const response = {
      voucher,
      signature,
      chainId,
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

    const payload = {
      method: 'post',
      url: `${server}/api/ethereum/rinkeby/loginConfirm`,
      headers: {},
      data: data
    };
    const axios_response = await axios_call(payload)
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
    const signer = provider.getSigner(address)
    const chainId = await signer.getChainId()
    const network_to_chainId = {
      1: 'main',
      4: 'rinkeby',
    }
    const blockchain = 'ethereum'
    const network = network_to_chainId[chainId]
    const api_path = `/api/${blockchain}/${network}`
    var config = {
      method: 'post',
      url: `${server}${api_path}/loginRequest`,
      headers: {},
      data: data
    };
    const loginRequestResponse = await axios_call(config)
    console.log('loginRequestResults: ', loginRequestResponse)

    if (!loginRequestResponse.data) {
      console.log('server not ready')
      return
    }
    const loginRequestResults = loginRequestResponse.data.results
    if (!loginRequestResults) {
      console.log('server results not found')
      return
    }
    const metaMaskSignature = await signLogin(signer, loginRequestResults)
    if (!metaMaskSignature) {
      console.log('signature failed')
      return
    }
    const connected_chainId = metaMaskSignature.chainId
    const loginConfirmResponse = await loginConfirm(metaMaskSignature)
    if (loginConfirmResponse.status === 200) {
      const confirm_results = loginConfirmResponse.data.results
      if (!confirm_results) {
        console.log('confirm reuslts empty')
        return
      }
      const address = confirm_results.address.toLowerCase()
      const session_fp = `${address}_${connected_chainId}`
      const payload = JSON.stringify(confirm_results)
      sessionStorage.setItem(session_fp, payload)
      return true
    }

  } catch (error) {
    console.log(error)
  }
}
const accountChangeListener = async (accounts) => {
  if (!accounts) {
    console.log('in accountChangeListener: no account connected')
    return
  }
  if (!accounts.length) {
    console.log('in accountChangeListener: no account connected')
    return
  }
  const userAddress = accounts[0]
  console.log('accountsChanged: ', userAddress)
  const validSession = checkSession(userAddress)
  console.log('validSession: ', validSession)

  if (!validSession) {
    console.log('initiate loginRequest from account change')
    await loginRequest(userAddress)
  }
}
const isExpire = (expire) => {
  try {
    const date_expire = new Date(expire * 1000)
    const date_now = new Date()
    const expired = date_expire.getTime() < date_now.getTime()
    return expired
  } catch (error) {
    console.log(error)
  }
}
const checkSession = (session_fp) => {
  try {
    // console.log('in checksession')
    // console.log('userAddress: ',userAddress)
    const session_data = sessionStorage.getItem(session_fp);
    // console.log('session_data: ',session_data)
    if (session_data) {
      const session_data_parsed = JSON.parse(session_data)
      if (isExpire(session_data_parsed.expire)) {
        console.log('session expire')
        return
      }
      return true
    } else {
      console.log('session data missing')
    }

  } catch (error) {
    console.log(error)
  }
}
const initListeners = async (ethereum, onChainIdChange, setlistenersSingelton, listenersSingelton) => {
  const valid_ethereum = Boolean(ethereum)
  console.log('initListeners: ', valid_ethereum)
  if (ethereum && !listenersSingelton) {
    ethereum.removeListener('accountsChanged', accountChangeListener)
    ethereum.on('accountsChanged', accountChangeListener)
    ethereum.removeListener('chainChanged', onChainIdChange)
    ethereum.on('chainChanged', onChainIdChange)
    setlistenersSingelton(true)
  }
}
var provider
var server
var axios

function isMobileDevice() {
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

const getAddress = async (signer)=>{
  try {
    const address = await signer.getAddress()
    return address
  } catch (error) {
    console.log(error.message)
  }
}

const isConnected = async (ethereum: any,ethers,isConnectedCallBack)=>{
  console.log('ethereum');
  console.log(ethereum);
  try {

      const response = {
        'app':false,
        'mobile':false,
        'connected':false,
        'chainId':null,
        'address':null,
      }
      response.mobile = isMobileDevice()
      if (ethereum){
        response.app = true
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const chainId = await signer.getChainId()
        response.chainId = chainId
        response.connected = true
        const address = await getAddress(signer)
        response.address = address
        isConnectedCallBack(response)
        return
      }
      isConnectedCallBack(response)

  } catch (error) {
    console.log(error)
    isConnectedCallBack(null)
  }
}
const connect = async (params, ethers, ethereum, _axios, onChainIdChange, setlistenersSingelton, listenersSingelton) => {
  axios = _axios
  const response = {
    valid: false,
    message: null,
    log: [],
    chainId: null,
    signer: null,
    session_fp: null,
    wallet: null
  }
  const log = response.log

  log.push('--- start flow ---')
  // const selected_env = config.globals.selected.environment
  server = params.api_server
  const selected_chainId = params.selected_chainId

  if (ethereum) {
    initListeners(ethereum, onChainIdChange, setlistenersSingelton, listenersSingelton)
    log.push('1. ethereum exist')
    provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await provider.send("eth_requestAccounts", []).catch((error) => {
      response.message = error.message
    });
    if (!accounts) return response
    if (accounts.length > 0) {
      log.push('2. eth account connected')
      const signer = provider.getSigner();
      let account = await signer.getAddress()
      account = account.toLowerCase()
      // const wallet_obj = new _ethers.Wallet(config.accounts.master.private_key, this.provider)
      const connected_chainId = await signer.getChainId()
      const session_fp = `${account}_${connected_chainId}`
      response.wallet = account
      response.chainId = connected_chainId
      response.session_fp = session_fp
      response.signer = signer
      if (connected_chainId === selected_chainId) {
        log.push(`3. same network on account and website`)
        const session_check = checkSession(session_fp)
        if (!session_check) {
          log.push(`4. session check failed`)
          log.push(`5. login to server`)
          console.log('before loginRequest: ', account)
          const loginRequestResponse = await loginRequest(account)
          console.log('loginRequestResponse: ', loginRequestResponse)
          if (!loginRequestResponse) {
            log.push(`6. server login failed`)
            response.message = 'server login failed'
            return response
          }
        }
        log.push(`--- login success ---`)
        response.valid = true
        response.message = 'ok'
        return response

      } else {
        if (connected_chainId != 1) {
          log.push(`3. different network on account and website: connected_chainId: ${connected_chainId}, selected_chainId: ${selected_chainId}`)
          log.push('4. user on testnet')

          response.message = `user on chainId# ${connected_chainId}`
          return response
        } else {
          log.push('4. user on mainnet')
          response.message = `user on chainId# ${connected_chainId}`
          return response
        }
        // if (connected_chainId===4)

      }

    } else {
      log.push('2. eth account not connected')
      response.message = 'connect account'
      return response
    }

  } else {
    log.push('1. ethereum not exist')
    const mobile = isMobileDevice()

    if (mobile) {
      log.push('2. mobile device detected')
      response.message = 'redirect to mobile deep link'
      return response
    } else {
      log.push('2. desktop detected')
      response.message = 'redirect to install wallet'
      return response
    }
  }
}

const signRedeemVoucher = async (signer, payload) => {
  try {
    const response = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // alert('response: ' + JSON.stringify(response));
    // alert('signer: ');
    // alert(signer);
    // alert('payload: ' + JSON.stringify(payload));
    const signature = await signer._signTypedData(payload.domain, payload.types, payload.voucher)
    return signature
  } catch (error) {
    // alert('error: ' + JSON.stringify(error));
    console.log(error)
  }
}
const claim = async (signer, ethers,results) => {
  try {
    console.log('in wallets claim1')
    const root_address = results.root.address
    const root_abi = results.root.abi
    const redeemVoucher = results.payload.redeemVoucher
    const claimVoucher = results.payload.claimVoucher
    const value = redeemVoucher.priceWEI
    console.log('signer: ',signer)
    const contract = new ethers.Contract(root_address, root_abi, signer);
    const res = await contract.redeem(redeemVoucher,claimVoucher, { value }).catch((error) => {
      if (error.error) {
        /* alert(error.error.message)*/;
        return null;
      }
    });
    return res
  } catch (error) {
    console.log(error)
  }
}
export {
  connect,
  signRedeemVoucher,
  claim,
  isConnected
}

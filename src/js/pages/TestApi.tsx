// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {ethers} from 'ethers';
import {connect,signRedeemVoucher,claim,isConnected} from '../components/wallet'
import React, {
  useEffect,
  useState,
  useRef
} from "react";
import config from '../config/default.json'
import {ethers} from 'ethers'
import axios from 'axios'
import {Create} from '../components/create'
// import {uploadToIPFS} from './IPFS/ipfs'
// import {colors} from 'http://127.0.0.1:3001/js/mod.js'


export const TestApi = () => {
  const onChainIdChange = (chainIdhex)=>{
    const chainId = parseInt(Number(chainIdhex))
    console.log('onChainIdChange #1: ')
    console.log('selected_chainId: ',selected_chainId)
    console.log('connected_chainid: ',chainId)
    setConnectedCainId(chainId)
    if (chainId!==selected_chainId){
      setConnectedMessage({message:`user on chainId# ${chainId}`,color:'red'})
    }else{
      setConnectedMessage({message:`user connected currectly, chanId# ${chainId}`,color:'green'})
      setSessionRef()
    }
  }
  const setSessionRef = ()=>{
    // console.log('in setSessionRef: ',session_fp.current)
    if (!session_fp.current)return
    const jres = sessionStorage.getItem(session_fp.current)
    // console.log('jres: ',jres)
    const session_data = JSON.parse(jres)
    const session_ = session_data.session
    // setSession({session})
    console.log('setSessionRef: session: ',session_)
    session_ref.current = session_
    // console.log('setSessionRef: session: ',session)
    // return session
  }


const callBack =async (response)=>{
  console.log('in callback')
  console.log('response: ',response)
  const message = response.message
  if (message==='ok'){
    const chainId = response.chainId
    setConnectedCainId(chainId)
    setConnectedMessage({message:`user connected currectly, chanId# ${chainId}`,color:'green'})
    console.log('response.session_fp: ',response.session_fp)
    // setSessionFP(response.session_fp)
    session_fp.current = response.session_fp
    signer_ref.current = response.signer
    creator_ref.current = response.wallet
    setSessionRef()
  }else{
    console.log('meesage: ',message)
    setConnectedMessage({message,color:'red'})
    if (message==='redirect to mobile deep link')return window.location.replace("https://metamask.app.link/dapp/mobiletest.imma.club/");
    if (message==='redirect to install wallet')return window.location.replace("https://metamask.io/download/");
  }
}

const isConnectedCallBack = (response)=>{
    is_connected_ref.current = response
    if (!is_connected_ref.current.connect){
      if (is_connected_ref.current.mobile){
        // return window.location.replace("https://metamask.app.link/dapp/mobiletest.imma.club/")
      }else{
        // return window.location.replace("https://metamask.io/download/");
      }
    }
    console.log('callback network_ref.current: ',network_ref.current)
    check_network(networkNameToId(network_ref.current))
}

  const init_wallet = async(callback)=>{
    console.log('selected_chainId: ',selected_chainId)
    const params = {
      selected_chainId,
      api_server:api_details_ref.current.api_server,
    }
    const response = await connect(params,ethers,window.ethereum,axios,onChainIdChange,setlistenersSingelton,listenersSingelton)
    callback(response)
  }

  const loginWallet = async ()=>{
    if (!is_connected_ref.current.connected){
      if (is_connected_ref.current.mobile){
        alert('you are not connected, please install metamask (redirect mobile)')
        window.location.replace("https://metamask.app.link/dapp/mobiletest.imma.club/")
        return
      }else{
        alert('you are not connected, please install metamask (redirect desktop)')
        window.location.replace("https://metamask.io/download/")
        return
      }
    }
    if (selected_chainId!==is_connected_ref.current.chainId)return alert('please change wallet network for selected one' )
    init_wallet(callBack)
  }

  const getApiDetails = ()=>{
    const selected = config.globals.selected.environment
    const network = network_ref.current
    const api_key = selected==='production'?`base_url`:`base_url_${selected}`
    const api_path = `/api/ethereum/${network}`

    const api_server = config.globals[api_key]
    // const api_server = 'http://localhost:3002'

    const api_base_url = `${api_server}${api_path}`;

    // const api_base_url = "http://localhost:3002/api/ethereum/rinkeby";

    const api_details = {
      selected,
      network,
      api_server,
      api_path,
      api_base_url,
    }
    return api_details
  }

  const networkNameToId = (name)=>{
    const networkTochainId = {
      main:1,
      rinkeby:4,
    }
    return networkTochainId[name]
  }

  const check_network = (selected_chainId)=>{
    try {
      // console.log('is_connected_ref: ',is_connected_ref.current)
      // console.log('check_network: ',selected_chainId)
      const chainIdToNetwork = {
        1:'main',
        4:'rinkeby',
      }
      const connected_network = chainIdToNetwork[is_connected_ref.current.chainId]
      console.log('connected_network: ',connected_network)
      const network = chainIdToNetwork[selected_chainId]
      if (!network && is_connected_ref.current.connected) return setConnectedMessage({message:`unsupported network: ${selected_chainId}`,color:'red'})
      if (!connected_network && is_connected_ref.current.connected) return setConnectedMessage({message:`unsupported network: ${selected_chainId}`,color:'red'})
      network_ref.current = network
      console.log('selected_chainId: ',selected_chainId)
      setSelectedCainId(selected_chainId)
      if (selected_chainId!==is_connected_ref.current.chainId){
        setConnectedMessage({message:`selected: ${network}, user on chainId# ${connected_network}`,color:'red'})
      }else{
        setConnectedMessage({message:`selected: ${network}, user on chainId# ${connected_network}`,color:'green'})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNetworkChange = (event)=>{
    const value = event.target.value
    console.log('value: ',value)
    const network_to_id = {
      'network_main':1,
      'network_rinkeby':4,
    }
    if (!network_to_id.hasOwnProperty(value))return;
    const selected = network_to_id[value]
    check_network(selected)
    api_details_ref.current = getApiDetails()

    // if(connected_chainId)init_wallet(callBack)
  }


  // const network_ref = useRef(config.globals.selected.network);
  const network_ref = useRef('main');
  const api_details_ref = useRef( getApiDetails());

  const [selected_chainId,setSelectedCainId] = useState(1)
  const [connected_chainId,setConnectedCainId] = useState(0)
  const [connected_message,setConnectedMessage] = useState({message:''})
  const [listenersSingelton,setlistenersSingelton] = useState(false)
  const is_connected_ref = useRef(null);
  const session_fp = useRef('');
  const session_ref = useRef('');
  const signer_ref = useRef(null);
  const creator_ref = useRef('login with wallet');

  const api_base_url = api_details_ref.current.api_server
  useEffect(() => {
    setSessionRef()
    isConnected(window.ethereum,ethers,isConnectedCallBack)
    }, []);
  return (
    <div className="App">
      <h1>ethereum connection test</h1>
      <div className="container">
      <h3>Global Network</h3>
      <label htmlFor="network">Network </label>
      <select onChange={handleNetworkChange} name="network" id="network">
        <option value="network_main">main net</option>
        <option value="network_rinkeby">rinkeby</option>
      </select>
      <p style={{color:connected_message.color}}>{connected_message.message}</p>
    </div>

      {/* <a href="https://metamask.app.link/dapp/mobiletest.imma.club">click</a> */}
      <button onClick={loginWallet}>login with wallet</button>
      <Create api_details_ref={api_details_ref} api_base_url={api_base_url} ethers={ethers} session={session_ref} signer_ref={signer_ref} creator_ref={creator_ref} signRedeemVoucher={signRedeemVoucher} claim={claim} />

    </div>
  );
}

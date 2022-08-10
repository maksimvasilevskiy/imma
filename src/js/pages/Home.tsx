import React from 'react';
import { HomeMain } from '../components/HomeMain';
import { Welcome } from '../components/Welcome';
import { About } from '../components/About';
import { Creation } from '../components/Creation';
import { LifeFeed } from '../components/LifeFeed';
import { AllNft } from '../components/AllNft';
import { ImmaProtocol } from '../components/ImmaProtocol';
import { Faq } from '../components/Faq';
import {connect,signRedeemVoucher,claim,isConnected} from '../components/wallet';
import {
  useEffect,
  useState,
  useRef,
  useReducer
} from "react";
import config from '../config/default.json';
import {ethers} from 'ethers';
import axios from 'axios';
import { State, reducer } from '../helpers/creationReducer';
import { v4 as uuidv4 } from "uuid";

export const initialState: State = {
  originalNft: '',
  originalNftVerified: false,
  creatorWallet: '',
  creatorWalletVerified: false,
  partnerWallet: '0x0000000000000000000000000000000000000000',
  partnerWalletVerified: false,
  hasPartnerWallet: false,
	price: {
		isFree: true,
		dollarValue: '391.34',
		ethereumValue: '0.14'
	},
	blockchain: null,
	video: null,
	signature: null,
	verification: {
		social: null,
		isVerified: false
	}
};

export const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

	const onChainIdChange = (chainIdhex)=>{
    const chainId = parseInt(chainIdhex);
    console.log('onChainIdChange #1: ');
    console.log('selected_chainId: ',selected_chainId);
    console.log('connected_chainid: ',chainId);
    setConnectedCainId(chainId);
    if (chainId!==selected_chainId){
      setConnectedMessage({message:`user on chainId# ${chainId}`,color:'red'});
    }else{
      setConnectedMessage({message:`user connected currectly, chanId# ${chainId}`,color:'green'});
      setSessionRef();
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
    const message = response.message;
    if (message==='ok'){
      const chainId = response.chainId;
      setConnectedCainId(chainId)
      setConnectedMessage({message:`user connected currectly, chanId# ${chainId}`,color:'green'})
      console.log('response.session_fp: ', response.session_fp)
      // setSessionFP(response.session_fp)
      session_fp.current = response.session_fp
      signer_ref.current = response.signer
      /*dispatch({
        type: 'SET_CREATOR_WALLET',
        value: response.wallet
      });
      dispatch({
        type: 'SET_CREATOR_WALLET_VERIFIED',
        value: true
      });*/
      console.log("ref: " + response.wallet);
      setSessionRef()
    }else{
      console.log('meesage: ', message)
      setConnectedMessage({message,color:'red'})
      if (message==='redirect to mobile deep link')return window.location.replace("https://metamask.app.link/dapp/mobiletest.imma.club/");
      if (message==='redirect to install wallet')return window.location.replace("https://metamask.io/download/");
    }
  }

  const isConnectedCallBack = (response)=>{
      is_connected_ref.current = response;
      if (!is_connected_ref.current.connect){
        if (is_connected_ref.current.mobile){
          // return window.location.replace("https://metamask.app.link/dapp/mobiletest.imma.club/")
        }else{
          // return window.location.replace("https://metamask.io/download/");
        }
      }
      console.log('callback network_ref.current: ', network_ref.current)
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

  const loginWallet = async (event, callBack)=>{
    if (event) {
      event.preventDefault();
    }
    if (!is_connected_ref.current.connected){
      console.log(is_connected_ref.current)
      if (is_connected_ref.current.mobile){
        /* alert('you are not connected, please install metamask (redirect mobile)')*/
        const domain = window.location.hostname;
        window.location.replace(`https://metamask.app.link/dapp/${domain}`)
        return
      } else {
        /* alert('you are not connected, please install metamask (redirect desktop)')*/
        window.location.replace("https://metamask.io/download/")
        return
      }
    }
    if (selected_chainId!==is_connected_ref.current.chainId)return /* alert('please change wallet network for selected one' )*/
    init_wallet(callBack)
  }

  const getApiDetails = ()=>{
    const selected = config.globals.selected.environment
    const network = network_ref.current
    console.log('network ' + network_ref.current);
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
    console.log('value: ',value);
    const network_to_id = {
      'network_main':1,
      'network_rinkeby':4,
    }
    if (!network_to_id.hasOwnProperty(value))return;
    const selected = network_to_id[value];
    check_network(selected);
    api_details_ref.current = getApiDetails();
  }

  const network_ref = useRef('rinkeby');
  const api_details_ref = useRef( getApiDetails());

  const [selected_chainId,setSelectedCainId] = useState(1);
  const [connected_chainId,setConnectedCainId] = useState(0);
  const [connected_message,setConnectedMessage] = useState({message:'', color: ''});
  const [listenersSingelton,setlistenersSingelton] = useState(false);
  const is_connected_ref = useRef(null);
  const session_fp = useRef('');
  const session_ref = useRef('');
  const signer_ref = useRef(null);
  const creator_ref = useRef('login with wallet');

  const api_base_url = api_details_ref.current.api_server;
  useEffect(() => {
    setSessionRef()
    isConnected(window.ethereum,ethers,isConnectedCallBack)
    }, []);

	return (
		<main className="main home">
			<div className="bg-lights"></div>
			<HomeMain />
			<Welcome />
			<About />
      <div className="api">
      <Creation
        api_details_ref={api_details_ref}
        api_base_url={api_base_url}
        ethers={ethers}
        session={session_ref}
        signer_ref={signer_ref}
        creator_ref={creator_ref}
        signRedeemVoucher={signRedeemVoucher}
        claim={claim}
        loginWallet={loginWallet}
        state={state}
        dispatch={dispatch}
      />
		  <LifeFeed />
			<AllNft />
			<ImmaProtocol />
			<Faq />
			</div>
    </main>
	);
};

import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { NftProductVideoItem } from '../components/NftProductVideoItem';
import { tableData, ITableData } from '../helpers/nftTableData';
import { ProductInfo } from '../components/ProductInfo';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import config from '../config/default.json';
import {ethers} from 'ethers';
import axios from 'axios';
import { Result, Response } from '../helpers/getLiveFeedTypes';
import { State, reducer } from '../helpers/creationReducer';
import {connect,signRedeemVoucher,claim,isConnected} from '../components/wallet';
import {
  confirmCode,
  sendCode,
  getSignedUrl,
  upload,
  getPreSignRedeemVoucher,
  verifySignature,
  claim_request,
  check_address,
  checkNFT
} from "../helpers/api";

export const initialState: State = {
  originalNft: '',
  originalNftVerified: false,
  creatorWallet: '',
  creatorWalletVerified: false,
  partnerWallet: '0x0000000000000000000000000000000000000000',
  partnerWalletVerified: false,
  hasPartnerWallet: false,
	price: {
		isFree: null,
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

export const Product: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

	const path = useParams();

	const [data, setData] = useState<Response | null>(null);

	const [video, setVideo] = useState<null | Result>(null);
	// TODO: Set status by API
	const [status, setStatus] = useState<string>('');
	const [coupled, setCoupled] = useState(false);
  const [ipfsCid, setIpfsCid] = useState("");
  const network_ref = useRef('rinkeby');

	useEffect(() => {
		setSessionRef()
		isConnected(window.ethereum,ethers,isConnectedCallBack)
		}, []);

	useEffect(() => {
		if (data && path) {
			const video: any = data.results;//.results.find((item: Result) => item.uid === path.nft);
			setVideo(video);
			setIpfsCid(video.uid);
      if (video.inft.minted) {
        setStatus('released');
      } else {
        setStatus('pending');
      }
      if (video.coupled) {
        setCoupled(true);
      } else {
        setCoupled(false);
      }
		}
	}, [data]);

	useEffect(() => {
    const config = {
			method: 'get',
			url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getNFT`,
			params: {
				requested: 'inft',
				ipfs_cid: path.nft
			}
			// headers: {
			// Origin: 'imma_postman'
			// }
		};
		/*const config = {
			method: 'get',
			url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getLiveFeed`
		};*/

		axios(config)
			.then((response) => {
				setData(response.data);
        console.log('response.data');
        console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

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
    if (!session_fp.current) return;
    const jres = sessionStorage.getItem(session_fp.current);
    const session_data = JSON.parse(jres);
    const session_ = session_data.session;
    console.log('setSessionRef: session: ',session_);
    session_ref.current = session_;
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
      dispatch({
        type: 'SET_CREATOR_WALLET',
        value: response.wallet
      });
      dispatch({
        type: 'SET_CREATOR_WALLET_VERIFIED',
        value: true
      });
      console.log("ref: " + response.wallet);
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

	const loginWallet = async (event)=>{
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
      }else{
        /* alert('you are not connected, please install metamask (redirect desktop)')*/
        window.location.replace("https://metamask.io/download/")
        return
      }
    }
    if (selected_chainId!==is_connected_ref.current.chainId)return /* alert('please change wallet network for selected one' )*/
    init_wallet(callBack)
  }

  const getApiDetails = ()=>{
    const selected = config.globals.selected.environment;
    const network = network_ref.current;
    console.log('network ' + network_ref.current);
    const api_key = selected==='production'?`base_url`:`base_url_${selected}`;
    const api_path = `/api/ethereum/${network}`;

    const api_server = config.globals[api_key];
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
    return api_details;
  }

  const networkNameToId = (name)=>{
    const networkTochainId = {
      main:1,
      rinkeby:4,
    }
    return networkTochainId[name];
  }

  const check_network = (selected_chainId)=>{
    try {
      const chainIdToNetwork = {
        1:'main',
        4:'rinkeby',
      }
      const connected_network = chainIdToNetwork[is_connected_ref.current.chainId];
      console.log('connected_network: ',connected_network);
      const network = chainIdToNetwork[selected_chainId];
      if (!network && is_connected_ref.current.connected) return setConnectedMessage({message:`unsupported network: ${selected_chainId}`,color:'red'});
      if (!connected_network && is_connected_ref.current.connected) return setConnectedMessage({message:`unsupported network: ${selected_chainId}`,color:'red'});
      network_ref.current = network;
      console.log('selected_chainId: ',selected_chainId);
      setSelectedCainId(selected_chainId);
      if (selected_chainId!==is_connected_ref.current.chainId){
        setConnectedMessage({message:`selected: ${network}, user on chainId# ${connected_network}`,color:'red'});
      }else{
        setConnectedMessage({message:`selected: ${network}, user on chainId# ${connected_network}`,color:'green'});
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleNetworkChange = (event)=>{
    const value = event.target.value;
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

	const handle_claim = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      console.log("in handle_claim");
      const ipfs_cid = ipfsCid;
      const claim_request_response = await claim_request(api_details_ref.current.api_base_url, session_ref.current, ipfs_cid);
      if (!claim_request_response) return /* alert('cliam request failed')*/;
      if (claim_request_response.status!==200) return /* alert('cliam request failed')*/;
      const results = claim_request_response.data.results;
      const claim_response = await claim(signer_ref.current, ethers, results);
      console.log(claim_response);
      setStatus('released');
      setCoupled(true);
    } catch (error) {
      console.log(error);
    }
  };

  const api_details_ref = useRef(getApiDetails());
  const api_base_url = api_details_ref.current.api_server;
	const [selected_chainId,setSelectedCainId] = useState(1)
	const [connected_chainId,setConnectedCainId] = useState(0)
	const [connected_message,setConnectedMessage] = useState({message:'', color: ''})
	const [listenersSingelton,setlistenersSingelton] = useState(false)
	const is_connected_ref = useRef(null);
	const session_fp = useRef('');
	const session_ref = useRef('');
	const signer_ref = useRef(null);
	const creator_ref = useRef('login with wallet');

	console.log('video');
	console.log(video);

	if (!video) {
		return (
			<main className="main product">
				<div className="bg-lights"></div>
				<section className="product-page">
					<div className="product-page__wrapper">
						<div className="container">
							<div className="product-page__info">
								<h2 className="title title_size-m product-page__title">
									Loading...
								</h2>
							</div>
						</div>
					</div>
				</section>
			</main>
		);
	} else {
    return (
  		<main className="main product">
  			<div className="bg-lights"></div>
  			<section className="product-page">
  				<div className="product-page__wrapper">
  					<div className="container">
  						<div className="product-page__content">
  							<div className="product-page__video">
  								<h2 className="title title_size-m product-page__title_video">
  									IMMA NFT <span>#{video.uid.slice(0, 5)}...</span>
  								</h2>
                  <NftProductVideoItem properties={video} />
  								{/*<NftVideoItem properties={video} videoHeight={658} />*/}
  							</div>
  							<ProductInfo
                  video={video}
  								status={status}
                  coupled={coupled}
  								session={session_ref}
  								handle_claim={handle_claim}
  								loginWallet={loginWallet}
  							/>
  						</div>
  					</div>
  				</div>
  			</section>
  		</main>
  	);
  }
};

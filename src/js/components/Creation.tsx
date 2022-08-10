import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SignaturePad from 'signature_pad';
import { CreationStep } from './CreationStep';
import { CreationVideo } from './CreationVideo';
import { CreationSubmit } from './CreationSubmit';
import { PriceRadio, BlockchainRadio, SocialRadio } from './CreationRadio';
import { ProgressBar } from './ProgressBar';
import {
  confirmCode,
  sendCode,
  getSignedUrl,
  upload,
  upload_sign,
  getPreSignRedeemVoucher,
  getOnlyPreSignRedeemVoucher,
  setPreSignRedeemVoucher,
  verifySignature,
  claim_request,
  check_address,
  checkNFT
} from "../helpers/api";
import { v4 as uuidv4 } from "uuid";

export const Creation = (props) => {
  const domain = window.location.hostname;
  const loginWallet = props.loginWallet;
  const api_base_url = props.api_base_url;
  const api_details_ref = props.api_details_ref;
  const ethers = props.ethers;
  const signer = props.signer_ref;
  const signRedeemVoucher = props.signRedeemVoucher;
  const claim = props.claim;
  const state = props.state;
  const dispatch = props.dispatch;
  const uuid_ = uuidv4();
  const [confirmCodeVal, setConfirmCodeVal] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(<p></p>);
  const [rid, setRid] = useState(uuid_);
  const session = useRef(uuid_);
  const [socialCode, setSocialCode] = useState("");

  const [originalNft, setOriginalNft] = useState("");
  const [ipfsCid, setIpfsCid] = useState("");
  const [checkPartnerAddressMsg, setCheckPartnerAddressMsg] = useState(null);
  const [checkCreatorWalletMsg, setCheckCreatorWalletMsg] = useState(null);
  const [checkOriginalNftMsg, setCheckOriginalNftMsg] = useState(null);

	const signFieldRef = useRef(null);
	const containerRef = useRef(null);

	const [signatureText, setSignatureText] = useState<string>('Sign here');
	const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
	const [signatureProgress, setSignatureProgress] = useState<number>(0);
  const [emptySignSize, setEmptySignSize] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isOnlyPreSignRedeemVoucher, setIsOnlyPreSignRedeemVoucher] = useState(false);

  useEffect(() => {
		if (searchParams.get("rid") && !isOnlyPreSignRedeemVoucher) {
      const _rid = searchParams.get("rid");
      setIsOnlyPreSignRedeemVoucher(true);
      handleOnlyPreSignRedeemVoucher(_rid);
    }
	}, [searchParams]);

	useEffect(() => {
		const windowWidth = window.innerWidth;

		if (windowWidth < 768) {
			setSignatureText('Put your signature here');
		} else {
			setSignatureText('Sign here');
		}
	}, [window.innerWidth]);

  const handleOnlyPreSignRedeemVoucher = async (_rid) => {
    try {
      // alert('rid in only pre... ' + _rid);
      const presigned_response = await getOnlyPreSignRedeemVoucher(
        _rid,
        api_details_ref.current.api_base_url,
        session.current
      );
      //// alert(JSON.stringify(presigned_response));
      if (!presigned_response) return // alert("something went wrong");
      if (presigned_response.status !== 200) {
        return // alert("status code " + presigned_response.status);
      } else {
        console.log("OnlyPreSign fields________");
        console.log("OnlyPreSign status code " + presigned_response.status);
        const results = presigned_response.data.results;
        console.log("Presigned_response.data");
        console.log(presigned_response.data);
        console.log("Results ");
        console.log(results);
        console.log("Results voucher ");
        console.log(results.voucher);
        const ethereum = window.ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("Signer ");
        console.log(signer);
        const signature = await signRedeemVoucher(signer, results);
        if (!signature) return // alert('signature failed');
        const verify_response = await verifySignature(_rid, api_details_ref.current.api_base_url, _rid, signature);
        if (!verify_response) return // alert('verify failed');
        setIpfsCid(verify_response.data.results.ipfs_cid);
      }
    } catch (error) {
      console.log(error);
    }
  }

	const enableSignaturePad = (): void => {
		const canvas: HTMLCanvasElement = signFieldRef.current;

		// Inits signature pad
		if (!signaturePad) {
      console.log('enable signature pad');

			function resizeCanvas(): void {
        console.log('resize canvas');
				var ratio = Math.max(window.devicePixelRatio || 1, 1);
				canvas.width = canvas.offsetWidth * ratio;
				canvas.height = canvas.offsetHeight * ratio;
				canvas.getContext('2d').scale(ratio, ratio);

  			const signaturePad = new SignaturePad(canvas, {
  				penColor: 'rgb(255, 255, 255)'
  			});

  			setSignaturePad(signaturePad);

        const dataURL = signaturePad.toDataURL('image/png');
        const blob = dataURItoBlob(dataURL);

        setEmptySignSize(blob.size);
			}

			window.onresize = resizeCanvas;
			resizeCanvas();
		} else {
			signaturePad.clear();
		}
	};

  const dataURItoBlob = (dataURI) => {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleSaveSign = (): void => {
    if (signaturePad) {
      const dataURL = signaturePad.toDataURL('image/png');
      const blob = dataURItoBlob(dataURL);
      const resultFile = new File([blob], "signature.png", {type:"image/png"});
      dispatch({
        type: 'SET_SIGNATURE',
        value: resultFile
      });
		} else {
      console.log('no signature pad');
		}
  }

  useEffect(() => {
    console.log('new signature:');
    console.log(state.signature);
    if (state.signature) {
      upload_sign_file();
    }
  }, [state.signature]);

  useEffect(() => {
    if (signatureProgress === 100) {
      setTimeout(() => setSignatureProgress(0), 1000);
    }
  }, [signatureProgress]);

  useEffect(() => {
    console.log('new video file');
    console.log(state.video);
    if (state.video) {
      upload_video_file();
    }
  }, [state.video]);

  const handleClearSign = (): void => {
    if (signaturePad) {
			signaturePad.clear();
      dispatch({
        type: 'SET_SIGNATURE',
        value: null
      });
      setSignatureProgress(0);
  		//signaturePad.clear();
      //setSignaturePad(null);
		} else {
      console.log('no signature pad');
		}
  }

  const confirm_code = async (event) => {
    try {
      console.log("in confirm_code");
      event.preventDefault();
      if (confirmCodeVal) return /*// alert("code already confirm")*/;
      if (!socialCode) return /*// alert("no code")*/;
      const code = parseInt(socialCode);
      const codeSession = session.current;
      const response = await confirmCode(api_details_ref.current.api_base_url, codeSession, code, rid);
      if (response) {
        setConfirmCodeVal(true);
        setConfirmMsg(<p style={{ color: "green" }}>code confirm</p>);
        dispatch({
          type: 'SET_SOCIAL_VERIFIED',
          value: true
        });
      } else {
        console.log("wrong code");
        setConfirmCodeVal(false);
        setConfirmMsg(<p style={{ color: "red" }}>wrong code</p>);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const get_signed_url = async (key) => {
    try {
      console.log("in get_signed_url");
      let signed_url = null;
      if (key === "video") {
        signed_url = await getSignedUrl(
          api_details_ref.current.api_base_url,
          session.current,
          rid,
          'myvideo.mp4',
          'video/mp4',
          state.video
        );
      }
      if (key === "signature") {
        signed_url = await getSignedUrl(
          api_details_ref.current.api_base_url,
          session.current,
          rid,
          state.signature.name,
          state.signature.type,
          state.signature
        );
      }
      return signed_url;
    } catch (error) {
      console.log(error);
    }
  };

  const upload_video_file = async () => {
    try {
      if (!state.video) return /*// alert(`no video file`)*/;
      const signed_url_response = await get_signed_url("video");
      if (!signed_url_response) return /*// alert("failed signing url")*/;
      const download_url = signed_url_response.data.results.downloadURL;
      const upload_url = signed_url_response.data.results.uploadURL;
      console.log("downloadURL: ", download_url);
      console.log("uploadURL: ", upload_url);
      await upload(upload_url, state.video.type, state.video);
    } catch (error) {
      console.log(error);
    }
  };

  const upload_sign_file = async () => {
    try {
      if (!state.signature || state.signature.size === emptySignSize) return console.log(`no signature file`);
      const signed_url_response = await get_signed_url("signature");
      if (!signed_url_response) return /*// alert("failed signing url")*/;
      const download_url = signed_url_response.data.results.downloadURL;
      const upload_url = signed_url_response.data.results.uploadURL;
      console.log("downloadURL: ", download_url);
      console.log("uploadURL: ", upload_url);
      console.log(state.signature.size);
      await upload_sign(upload_url, state.signature.type, state.signature, setSignatureProgress);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (event) => {
    const id = event.target.id;
    switch (id) {
      case "original_nft":
        dispatch({
          type: 'SET_ORIGINAL_NFT',
          value: event.target.value
        });
        return;
      case "partner_address":
        dispatch({
          type: 'SET_PARTNER_WALLET',
          value: event.target.value
        });
        return;
      case "creator_address":
        dispatch({
          type: 'SET_CREATOR_WALLET',
          value: event.target.value
        });
        return;
      case "social_code":
        setSocialCode(event.target.value);
        return;
      default:
        return;
    }
  };

  const gatherPreSignedData = ()=>{
    try {
      let price = '';
      let isFree = false;
      if (state.price.isFree === true) {
        price = 'price_free';
        isFree = true;
      } else {
        price = 'price_value';
        isFree = false;
      }
      const essentials = {
        'creator_address': state.creatorWallet,
        'original_nft': state.originalNft,
        'partner_address': state.partnerWallet,
        'price': price,
        'price_eth': !isFree ? parseFloat(state.price.ethereumValue) : 0,
        'price_usd': !isFree ? parseFloat(state.price.dollarValue) : 0,
      }
      console.log(essentials);
      const invalid = [];
      for (const [key,value] of Object.entries(essentials)){
        if (!value && !(isFree && (key === 'price_eth' || key === 'price_usd'))) invalid.push(`${key}`);
      }
      const response = {
        'essentials': null,
        'valid': false,
        invalid,
      }
      if (invalid.length) return response;
      response.valid = true;
      response.essentials = essentials;
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  function isMobileDevice() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }

  const handle_create = async (event) => {
    try {
      event.preventDefault();
      console.log("in handle_create");
      const response = gatherPreSignedData();
      if (!response) return // alert('error in gather');
      if (!response.valid) return // alert('missing data: ' + response.invalid.join(', '));
      console.log(response);
      const presigned_response = await setPreSignRedeemVoucher(
        rid,
        api_details_ref.current.api_base_url,
        session.current,
        response.essentials
      );
      if (!presigned_response) return // alert("something went wrong");
      if (presigned_response.status !== 200) {
        return // alert("status code " + presigned_response.status);
      }
      if (isMobileDevice()) {
        // alert('mobile device')
        //const domain = window.location.hostname;
        //window.location.replace(`https://metamask.app.link/dapp/${domain}?rid=${rid}`)
        window.location.replace(`https://metamask.app.link/dapp/${domain}/?rid=${rid}`);
        // alert(`https://metamask.app.link/dapp/${domain}/?rid=${rid}`);
        //document.getElementById("creation-redirect").click();
      }
      const results = presigned_response.data.results;
      const ethereum = window.ethereum;
      console.log("ethereum: ");
      console.log(ethereum);
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log("provider: ");
      console.log(provider);
      const signer = provider.getSigner();
      console.log("signer: ");
      console.log(signer);
      const signature = await signRedeemVoucher(signer, results);
      console.log("signature: ", signature);
      if (!signature) return /*// alert('signature failed')*/;
      console.log('rid: ', rid);
      console.log('session: ', session.current);
      const verify_response = await verifySignature(rid, api_details_ref.current.api_base_url, session.current, signature);
      if (!verify_response) return /*// alert('verify failed')*/;
      setIpfsCid(verify_response.data.results.ipfs_cid);
    } catch (error) {
      console.log(error);
    }
  };

  const check_address_ = async (event)=>{
    try {
      console.log('in check_address_');
      event.preventDefault();
      const id_ = event.target.id;
      if (id_ === 'check_partner_address') {
        const address = state.partnerWallet;
        console.log('event: ', event.target);
        console.log('address: ', address);
        const check_response = await check_address(api_details_ref.current.api_base_url, session.current,address);
        if (!check_response) return /* alert('failed check call')*/;
        if (check_response.status !== 200) return /* alert('failed check call')*/;
        const check_partner_address = check_response.data.results.valid;
        const check_partner_address_msg = check_partner_address?'':<div className="filed-error">Code error</div>;
        setCheckPartnerAddressMsg(check_partner_address_msg);
        if (check_partner_address) {
          dispatch({
            type: 'SET_PARTNER_WALLET_VERIFIED',
            value: true
          });
        } else {
          dispatch({
            type: 'SET_PARTNER_WALLET_VERIFIED',
            value: false
          });
        }
        return;
      }
      if (id_ === 'check_creator_wallet') {
        const address = state.creatorWallet;
        console.log('event: ', event.target);
        console.log('address: ', address);
        const check_response = await check_address(api_details_ref.current.api_base_url, session.current,address);
        if (!check_response) return /*// alert('failed check call')*/;
        if (check_response.status !== 200) return /*// alert('failed check call')*/;
        const check_creator_wallet = check_response.data.results.valid;
        const check_creator_wallet_msg = check_creator_wallet?'':<div className="filed-error">Code error</div>;
        setCheckCreatorWalletMsg(check_creator_wallet_msg);
        if (check_creator_wallet) {
          dispatch({
            type: 'SET_CREATOR_WALLET_VERIFIED',
            value: true
          });
        } else {
          dispatch({
            type: 'SET_CREATOR_WALLET_VERIFIED',
            value: false
          });
        }
        return;
      }
      return /*// alert('unknown id')*/;
    } catch (error) {
      console.log(error);
    }
  }

  const check_nfta = async (event)=>{
    event.preventDefault();
    try {
      console.log('in check_address_');
      const id_ = event.target.id;
      if (id_==='check_original_nft'){
        const original_nft = state.originalNft;
        console.log('event: ', event.target);
        console.log('original_nft: ', original_nft);
        const [sc,tokenId] = original_nft.split('/');
        const check_response = await checkNFT(api_details_ref.current.api_base_url, session.current,sc, tokenId);
        if (!check_response) return /*// alert('failed check call')*/;
        if (check_response.status!==200) return /*// alert('failed check call')*/;
        const check_original_nft = check_response.data.results.valid;
        const check_original_nft_msg = check_original_nft?'':<div className="filed-error">Code error</div>;
        setCheckOriginalNftMsg(check_original_nft_msg);
        if (check_original_nft) {
          dispatch({
            type: 'SET_ORIGINAL_NFT_VERIFIED',
            value: true
          });
        } else {
          dispatch({
            type: 'SET_ORIGINAL_NFT_VERIFIED',
            value: false
          });
        }
        return;
      }
      return /*// alert('unknown id')*/;
    } catch (error) {
      console.log(error);
    }
  }

	return (
		<section id="creation" className="section creation" ref={containerRef}>
      <a id="creation-redirect" href={`https://metamask.app.link/dapp/${domain}/?rid=${rid}`}>redirect</a>
			<div className="section-wrapper creation-wrapper">
				<ProgressBar containerRef={containerRef} state={state} />
				<div className="creation-content">
					<h2 className="title title_size-m creation-title">IMMA NFT creation</h2>
					<CreationStep number="01" title="Add wallet">
						<div className="step-wrapper">
              <div className="step-block__wrapper">
                <form action="" className="form step-block">
                  <h4 className="title title_size-xs step-block__title">Original NFT for your imma NFT to follow</h4>
                  <div className="input-wrap">
                    <input
                      className={`input step-block__input ${(checkOriginalNftMsg && !state.originalNftVerified) ? 'input-error' : ''}`}
                      type="text"
                      id="original_nft"
                      name="original_nft"
                      onChange={handleChange}
                      required
                    />
                    {state.originalNftVerified ?
                      <div className="input-icon">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3.5L5.5 8L12.5 1" stroke="#D6FF7E" strokeWidth="2"/>
                        </svg>
                      </div>
                      :
                      ((checkOriginalNftMsg) ? <div className="input-icon">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L13 13M13 1L1 13" stroke="#FF2525" strokeWidth="2"/>
                        </svg>
                      </div> : '')
                    }
                    {checkOriginalNftMsg}
                  </div>
                  <button
                    id="check_original_nft"
                    type="submit"
                    className="btn-arrow step-block__submit"
                    onClick={check_nfta}
                  >
                    Confirm
                  </button>
                </form>
              </div>
              <div className="step-block__wrapper">
                <form action="" className="form step-block">
                  <h4 className="title title_size-xs step-block__title">The imma NFT creator wallet</h4>
                  <div className="input-wrap">
                    <input
                      className={`input step-block__input ${(checkCreatorWalletMsg && !state.creatorWalletVerified) ? 'input-error' : ''}`}
                      type="text"
        	            id="creator_address"
        	            name="creator_address"
                      onChange={handleChange}
                      required
                    />
                    {state.creatorWalletVerified ?
                      <div className="input-icon">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3.5L5.5 8L12.5 1" stroke="#D6FF7E" strokeWidth="2"/>
                        </svg>
                      </div>
                      :
                      ((checkCreatorWalletMsg) ? <div className="input-icon">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L13 13M13 1L1 13" stroke="#FF2525" strokeWidth="2"/>
                        </svg>
                      </div> : '')
                    }
                    {checkCreatorWalletMsg}
                  </div>
                  <button
                    id="check_creator_wallet"
                    type="submit"
                    className="btn-arrow step-block__submit"
                    onClick={check_address_}
                  >
                    Confirm
                  </button>
                </form>
              </div>
							{state.hasPartnerWallet && (
                <div className="step-block__wrapper">
            			<form action="" className="form step-block">
            				<h4 className="title title_size-xs step-block__title">Broker wallet</h4>
                    <div className="input-wrap">
                      <input
                        className={`input step-block__input ${(checkPartnerAddressMsg && !state.partnerWalletVerified) ? 'input-error' : ''}`}
                        type="text"
                        id="partner_address"
                        name="partner_address"
                        value={state.partnerWallet}
                        onChange={handleChange}
                        required
                      />
                      {state.partnerWalletVerified ?
                        <div className="input-icon">
                          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 3.5L5.5 8L12.5 1" stroke="#D6FF7E" strokeWidth="2"/>
                          </svg>
                        </div>
                        :
                        ((checkPartnerAddressMsg) ? <div className="input-icon">
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M13 1L1 13" stroke="#FF2525" strokeWidth="2"/>
                          </svg>
                        </div> : '')
                      }
                      {checkPartnerAddressMsg}
                    </div>
            				<button
                      id="check_partner_address"
            					className="btn-arrow step-block__submit"
            					onClick={check_address_}
            				>
            					Confirm
            				</button>
            			</form>
            		</div>
							)}
							{!state.hasPartnerWallet && (
								<div className="step-block_add">
									<button
										type="button"
										className="step-block__add-btn"
										onClick={() => dispatch({ type: 'ADD_PARTNER_WALLET' })}
									>
										<span></span>
										<span></span>
									</button>
									<p className="step-block__add-note">
										*add another wallet (third party, intermediary)
									</p>
								</div>
							)}
						</div>
					</CreationStep>
					<CreationStep number="02" title="Price for the first sell">
						<div className="step-wrapper">
							<PriceRadio id="price" isFree={true} price={state.price} dispatch={dispatch} />
							<PriceRadio
								isFree={false}
								price={state.price}
								dispatch={dispatch}
								input={true}
							/>
						</div>
					</CreationStep>
					<CreationStep number="03" title="Blockchain network">
						<div className="step-wrapper step-wrapper_blockchain">
							<BlockchainRadio
								type="ethereum"
								blockchain={state.blockchain}
								dispatch={dispatch}
							/>
							<BlockchainRadio
								type="polygon"
								blockchain={state.blockchain}
								dispatch={dispatch}
							/>
						</div>
					</CreationStep>
					<CreationStep number="04" title="Create a video">
						<CreationVideo dispatch={dispatch} />
					</CreationStep>
					<CreationStep number="05" title="Your signature">
						<div className="step-wrapper">
							<div className="step-block_sign">
								<div
									className="step-block__sign step-block__sign_active"
									style={
										signaturePad ? { display: 'none' } : { display: 'block	' }
									}
								>
									<svg
										width="97"
										height="218"
										viewBox="0 0 97 218"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M56.8427 181.364C33.5056 150.907 18.3445 111.607 6.02359 75.5246C-0.0176277 57.8325 -2.65165 29.6244 9.00498 13.9995C23.8194 -5.85812 36.3543 36.6261 39.903 45.9817C43.0519 54.2834 46.7392 63.2681 47.0855 72.2722C47.4971 82.9748 49.3052 50.9382 51.3543 40.4255C53.3905 29.9787 55.2271 -1.53383 71.2076 1.0576C93.461 4.66625 95.8718 26.4331 95.8718 44.7621C95.8718 81.0366 74.7178 113.931 60.6372 146.468C53.3586 163.288 46.7623 180.353 37.4637 196.203C33.3042 203.293 28.259 209.779 23.9119 216.734"
											stroke="white"
											strokeLinecap="round"
										/>
									</svg>
								</div>
								<button
									type="button"
									className="step-block__sign-btn"
									aria-label="sign"
									onClick={enableSignaturePad}
								>
									<svg
										width="32"
										height="33"
										viewBox="0 0 32 33"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M30.1067 8.04228L24.8889 2.79784C24.5441 2.45479 24.0775 2.26221 23.5912 2.26221C23.1048 2.26221 22.6382 2.45479 22.2934 2.79784L3.79561 21.269L2.10672 28.5578C2.04846 28.8243 2.05045 29.1004 2.11256 29.366C2.17467 29.6315 2.29532 29.8799 2.46571 30.0929C2.63609 30.3058 2.8519 30.4781 3.09736 30.597C3.34283 30.7159 3.61176 30.7784 3.88449 30.7801C4.01158 30.7929 4.13963 30.7929 4.26672 30.7801L11.6356 29.0912L30.1067 10.6378C30.4498 10.293 30.6423 9.82645 30.6423 9.34006C30.6423 8.85368 30.4498 8.38708 30.1067 8.04228V8.04228ZM10.7467 27.4912L3.84005 28.9401L5.41338 22.1667L19.2534 8.38006L24.5867 13.7134L10.7467 27.4912ZM25.7778 12.4245L20.4445 7.09117L23.5378 4.01562L28.7823 9.34895L25.7778 12.4245Z"
											fill="#D6FF7E"
										/>
									</svg>
								</button>
								<canvas
									ref={signFieldRef}
									width="470"
									height="300"
									className="step-wrapper__sign"
								></canvas>
								<span style={signaturePad ? { display: 'none' } : null}>
									{signatureText}
								</span>
                <div className="step-wrapper__sign-elements">
                  <div className="signature__upload">
                    <div className={`signature__upload-bar-wrap ${signatureProgress ? 'active-signature-wrap' : ''}`}>
                      {signatureProgress ? <div className="signature__upload-bar" style={{width: signatureProgress + '%'}}></div> : ''}
                    </div>
                    <div className="signature__upload-bar-text">
                      {signatureProgress ? (`Loading: ${signatureProgress}%`) : ''}
                    </div>
                  </div>
                  <div className="step-wrapper__sign-buttons">
                    <button className="step-wrapper__sign-button" onClick={handleSaveSign} id="sign-save">
                      <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.46094 4.99989L7.72617 11.2654L17.4666 1.5249" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className="step-wrapper__sign-button" onClick={handleClearSign} id="sign-clear">
                      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.84082 1.32715L15.0859 14.5725M15.0859 1.32715L1.84082 14.5722" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
							</div>
						</div>
					</CreationStep>
					<CreationStep
						number="06"
						title="Enter a Twitter or Instagram username to verify your user"
					>
						<div className="step-wrapper step-wrapper_social">
							<SocialRadio
								type="instagram"
								verification={state.verification}
								dispatch={dispatch}
                session={session}
                rid={rid}
                sendCode={sendCode}
                api_details_ref={api_details_ref}
							/>
							<SocialRadio
								type="twitter"
								verification={state.verification}
								dispatch={dispatch}
                session={session}
                rid={rid}
                sendCode={sendCode}
                api_details_ref={api_details_ref}
							/>
						</div>
						<form className="step-code" action="">
							<label>
								Enter the code
								<div className="step-code__input-wrapper">
                  <input
                    className="input"
      	            onChange={handleChange}
      	            type="text"
      	            id="social_code"
      	            name="social_code"
      	            key="social_code"
                    maxLength={8}
      	          ></input>
      	          <button
      	            id="submit_code"
      	            name="submit_code"
      	            key="submit_code"
      	            onClick={confirm_code}
                    className="btn step-code__submit"
      	          >
      	            Submit
      	          </button>
      	          <br></br>
      	          {confirmMsg}
								</div>
							</label>
						</form>
					</CreationStep>
					<CreationSubmit
            loginWallet={loginWallet}
            handle_create={handle_create}
            state={state}
            dispatch={dispatch}
            session={session}
            rid={rid}
          />
				</div>
			</div>
		</section>
	);
};

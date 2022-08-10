import React, { useReducer, useState, useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';
import { State, reducer } from '../helpers/creationReducer';
import { CreationStep } from './CreationStep';
import { CreationForm } from './CreationForm';
import { CreationVideo } from './CreationVideo';
import { CreationSubmit } from './CreationSubmit';
import { PriceRadio, BlockchainRadio, SocialRadio } from './CreationRadio';
import { ProgressBar } from './ProgressBar';

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
import { v4 as uuidv4 } from "uuid";

export const initialState: State = {
  wallets: {
    originalWallet: {
      walletNumber: '',
      isVerified: false
    },
    creatorWallet: {
      walletNumber: '',
      isVerified: false
    }
  },
  price: {
    isFree: null,
    dollarValue: 391.34,
    ethereumValue: 0.14
  },
  blockchain: null,
  video: null,
  signature: null,
  verification: {
    social: null,
    isVerified: false
  }
};

export const Creation = (props) => {
  const api_base_url = props.api_base_url;
  const api_details_ref = props.api_details_ref;
  // console.log('this.api_base_url: ',this.api_base_url)
  const session = props.session;
  const ethers = props.ethers;
  const signer = props.signer_ref;
  const creator_ref = props.creator_ref;
  const signRedeemVoucher = props.signRedeemVoucher;
  const claim = props.claim;
  console.log("create: session: ", session);
  const uuid_ = uuidv4();
  const partner_address = '0x0000000000000000000000000000000000000000';
  const [confirmCode, setConfirmCode] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(<p></p>);
  const [blockchain, setBlockchain] = useState("ethereum");
  const [priceEth, setPriceEth] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [social, setSocial] = useState("social_instagram");
  const [rid, setRid] = useState(uuid_);
  const [partnerAddress, setPartnerAddress] = useState(partner_address);

  const [socialUsername, setSocialUsername] = useState("");
  const [social, setSocial] = useState("");
  const [socialCode, setSocialCode] = useState("");
  const [signature, setSignature] = useState("");
  const [video, setVideo] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [price, setPrice] = useState("");
  const [originalNft, setOriginalNft] = useState("");
  const [ipfsCid, setIpfsCid] = useState("");
  const [checkPartnerAddressMsg, setCheckPartnerAddressMsg] = useState("");
  const [checkOriginalNftMsg, setCheckOriginalNftMsg] = useState("");


  const send_code = async (event) => {
    try {
      console.log("in send_code");
      event.preventDefault();
      if (!socialUsername) return; /*alert("no username")*/
      if (!social) return; /*alert("no social selection")*/
      const type_ = social.replace("social_", "");
      const username = socialUsername;
      const codeSession = session.current;
      console.log("session: ", session);
      sendCode(api_details_ref.current.api_base_url, codeSession, username, type_, rid);
    } catch (error) {
      console.log(error);
    }
  };

  const confirm_code = async (event) => {
    try {
      console.log("in confirm_code");
      event.preventDefault();
      if (confirmCode) return; /*alert("code already confirm")*/
      if (!socialCode) return; /*alert("no code")*/
      const code = parseInt(socialCode);
      const codeSession = session.current;
      const response = await confirmCode(api_details_ref.current.api_base_url, codeSession, code);
      if (response) {
        setConfirmCode(true);
        setConfirmMsg(<p style={{ color: "green" }}>code confirm</p>);
      } else {
        console.log("wrong code");
        setConfirmCode(false);
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
          this.video.name,
          this.video.type,
          this.video
        );
      }
      if (key === "signature") {
        signed_url = await getSignedUrl(
          api_details_ref.current.api_base_url,
          session.current,
          rid,
          this.signature.name,
          this.signature.type,
          this.signature
        );
      }
      return signed_url;
    } catch (error) {
      console.log(error);
    }
  };

  const upload_file = async (event) => {
    try {
      event.preventDefault();
      const id_ = event.target.id;
      const key = id_.replace("button_", "");
      if (key === "video") {
        if (!video) return; /*alert(`no ${key} file`)*/
      }
      if (key === "signature") {
        if (!signature) return; /*alert(`no ${key} file`)*/
      }
      const signed_url_response = await get_signed_url(key);
      if (!signed_url_response) return; /*alert("failed signing url");*/
      const download_url = signed_url_response.data.results.downloadURL;
      const upload_url = signed_url_response.data.results.uploadURL;
      console.log("downloadURL: ", download_url);
      console.log("uploadURL: ", upload_url);
      if (key === "video") {
        await upload(upload_url, video.type, video);
      }
      if (key === "signature") {
        await upload(upload_url, signature.type, signature);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (event) => {
    const id = event.target.id;
    if (["price_usd", "price_eth"].includes(id)) {
      const value = event.target.value ? parseFloat(event.target.value) : "";
      console.log("value: ", typeof value);
      if (value === "") {
        setPriceEth("");
        setPriceUsd("");
        return;
      }
      const value_ = parseFloat(value);
      if (id === "price_usd") {
        const price_eth = value_ / 2000;
        setPriceEth(price_eth);
      } else {
        const price_usd = value_ * 2000;
        setPriceUsd(price_usd);
      }
      return;
    }
    if (["video", "signature"].includes(id)) {
      const value = event.target.files[0];
      if (id === "video") {
        setVideo(value);
      } else {
        setSignature(value);
      }
      return;
    }
    if (id === "original_nft") {
      setOriginalNft(value);
      return;
    }
    if (id === "partner_address") {
      setPartnerAddress(value);
      return;
    }
    if (id === "price") {
      setPrice(value);
      return;
    }
    if (id === "blockchain") {
      setBlockchain(value);
      return;
    }
    if (id === "social") {
      setSocial(value);
      return;
    }
    if (id === "social_username") {
      setSocialUsername(value);
      return;
    }
    if (id === "social_code") {
      setSocialCode(value);
      return;
    }
  };

  const gatherPreSignedData = ()=>{
    try {
      let price_eth = 0
      if (priceEth!=''){
        price_eth = priceEth;
      }
      const essentials = {
        'creator_address': creator_ref.current,
        'original_nft': originalNft,
        'partner_address': partnerAddress,
        'price': price,
        'price_eth': price_eth,
        'price_usd': priceUsd,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
      }
      const invalid = [];
      for (const [key,value] of Object.entries(essentials)){
        if (!value) invalid.push(`${key}`);
      }
      const response = {
        'valid':false,
        invalid
      }
      if (invalid.length) return response;
      response.valid = true;
      response.essentials = essentials;
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const handle_create = async (event) => {
    try {
      event.preventDefault();
      console.log("in handle_create");
      const response = gatherPreSignedData();
      if (!response) return; /*alert('error in gather');*/
      if (!response.valid) return; /*alert('missing data: ' + response.invalid.join(', '));*/
      console.log('rid ' + rid);
      const presigned_response = await getPreSignRedeemVoucher(
        rid,
        api_details_ref.current.api_base_url,
        session.current,
        response.essentials
      );
      if (!presigned_response) return; /*alert("something went wrong");*/
      if (presigned_response.status !== 200)
        return; /*alert("status code ", presigned_response.status);*/
      const results = presigned_response.data.results;
      // console.log("results: ", results);
      const signature = await signRedeemVoucher(signer.current,results);
      console.log("signature: ", signature);
      if (!signature) return; /*alert('signature failed');*/
      console.log('rid: ', rid);
      console.log('session: ', session.current);
      const verify_response = await verifySignature(rid, api_details_ref.current.api_base_url, session.current,signature);
      if (!verify_response) return; /*alert('verify failed');*/
      setIpfsCid(verify_response.data.results.ipfs_cid);
      // console.log(verify_response)
    } catch (error) {
      console.log(error);
    }
  };

  const handle_claim = async (event) => {
    try {
      event.preventDefault();
      console.log("in handle_claim");
      const ipfs_cid = ipfsCid;
      const claim_request_response = await claim_request(api_details_ref.current.api_base_url, session.current, ipfs_cid);
      if (!claim_request_response) return; /*alert('cliam request failed');*/
      if (claim_request_response.status!==200) return; /*alert('cliam request failed');*/
      const results = claim_request_response.data.results;
      const claim_response = await claim(signer.current, ethers,results);
      console.log(claim_response);
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
        const address = partnerAddress;
        console.log('event: ', event.target);
        console.log('address: ', address);
        const check_response = await check_address(api_details_ref.current.api_base_url, session.current,address);
        if (!check_response) return; /*alert('failed check call');*/
        if (check_response.status !== 200) return; /*alert('failed check call');*/
        const check_partner_address = check_response.data.results.valid;
        const check_partner_address_msg = check_partner_address ? <div style={{color:"green"}}>valid</div>:<div style={{color:"red"}}>invalid</div>;
        setCheckPartnerAddressMsg(check_partner_address_msg);
        return;
      }
      return; /*alert('unknown id');*/
    } catch (error) {
      console.log(error);
    }
  }

  const check_nfta = async (event)=>{
    try {
      console.log('in check_address_');
      event.preventDefault();
      const id_ = event.target.id;
      if (id_==='check_original_nft'){
        const original_nft = original_nft;
        console.log('event: ', event.target);
        console.log('original_nft: ', original_nft);
        const [sc,tokenId] = original_nft.split('/');
        const check_response = await checkNFT(api_details_ref.current.api_base_url, session.current,sc, tokenId);
        if (!check_response) return; /*alert('failed check call');*/
        if (check_response.status!==200) return; /*alert('failed check call');*/
        const check_original_nft = check_response.data.results.valid;
        const check_original_nft_msg = check_original_nft?<div style={{color:"green"}}>valid</div>:<div style={{color:"red"}}>invalid</div>;
        setCheckOriginalNftMsg(check_original_nft_msg);
        return;
      }
      return; /*alert('unknown id');*/
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container-fluid">
      <form>
        <div className="container">
          <h3>01 Add Wallet</h3>
          <label htmlFor="original_nft">OriginalNFT:</label>{" "}
          <input
            onChange={handleChange}
            type="text"
            id="original_nft"
            name="original_nft"
          ></input>
          <button id="check_original_nft" onClick={check_nfta}>check</button>
          {checkOriginalNftMsg}
          <br></br>
          <label htmlFor="creator_address">Creator:</label>{" "}
          <input
            // onChange={this.handleChange}
            type="text"
            id="creator_address"
            name="creator_address"
            value={creator_ref.current}
            disabled
          ></input>
          <br></br>
          <label htmlFor="partner_address">Partner:</label>{" "}
          <input
            onChange={handleChange}
            type="text"
            id="partner_address"
            name="partner_address"
            value={partnerAddress}
          ></input>
          <button id="check_partner_address" onClick={check_address_}>check</button>
          {checkPartnerAddressMsg}
        </div>
        <br></br>
        <div className="container">
          <h3>02 Price of the IMMA NFT</h3>
          <select onChange={handleChange} name="price" id="price">
            <option value="price_free">For Free</option>
            <option value="price_value">For A Price</option>
          </select>
          <br></br>
          <label htmlFor="price_eth">Price ETH </label>
          <input
            onChange={handleChange}
            type="number"
            id="price_eth"
            name="price_eth"
            key="price_eth"
            value={priceEth}
          ></input>
          <br></br>
          <label htmlFor="price_usd">Price USD </label>
          <input
            onChange={handleChange}
            type="number"
            id="price_usd"
            name="price_usd"
            key="price_usd"
            value={priceUsd}
          ></input>
        </div>
        <div className="container">
          <h3>03 Network</h3>
          <label htmlFor="network">Blockchain network </label>

          <select
            onChange={handleChange}
            name="blockchain"
            id="blockchain"
          >
            <option value="ethereum">ethereum</option>
            <option value="polygon" disabled>
              polygon
            </option>
          </select>
        </div>
        <div className="container">
          <h3>03 Create a video</h3>
          <label htmlFor="video">Choose Video </label>
          <input
            onChange={handleChange}
            type="file"
            id="video"
            name="video"
            key="video"
          ></input>
          <button id="button_video" onClick={upload_file}>
            upload video
          </button>
        </div>
        <div className="container">
          <h3>05 Your signature</h3>
          <label htmlFor="signature">Choose signature </label>
          <input
            onChange={handleChange}
            type="file"
            id="signature"
            name="signature"
            key="signature"
          ></input>
          <button id="button_signature" onClick={upload_file}>
            upload signature
          </button>
        </div>
        <div className="container">
          <h3>
            06 Enter a Twitter or Instagram username to verify your user
          </h3>

          {/* <label htmlFor="social">Blockchain network </label> */}
          <select onChange={handleChange} name="social" id="social">
            <option value="social_instagram">Instagram</option>
            <option value="social_twitter">Twitter</option>
          </select>
          <br></br>
          <label htmlFor="social_username">social username </label>
          <input
            onChange={handleChange}
            type="text"
            id="social_username"
            name="social_username"
            key="social_username"
          ></input>
          <button
            id="send_code"
            name="send_code"
            key="send_code"
            onClick={send_code}
          >
            send code
          </button>
          <br></br>
          <input
            onChange={handleChange}
            type="number"
            id="social_code"
            name="social_code"
            key="social_code"
          ></input>
          <button
            id="submit_code"
            name="submit_code"
            key="submit_code"
            onClick={confirm_code}
          >
            sumbit code
          </button>
          <br></br>
          {confirmMsg}
        </div>
        <div className="container">
          <h3>Create IMMA NFT</h3>
          <button
            id="create_nft"
            name="create_nft"
            key="create_nft"
            onClick={handle_create}
          >
            Create
          </button>
          <br></br>
          {ipfsCid}
        </div>
        <br></br>
        <div className="container">
          <h3>TestClaim</h3>
          <button
            id="test_claim"
            name="test_claim"
            key="test_claim"
            value='bafybeidvuzr7mzfz6vtga622rjjrlftwsgmjnm6wbjh2ahcdh6rx5qnpya'
            onClick={handle_claim}
          >
            Claim
          </button>
        </div>
      </form>
    </div>
  );
};

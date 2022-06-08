import React from "react";
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

export class Create extends React.Component {
  constructor(props) {
    super();
    this.api_base_url = props.api_base_url
    this.api_details_ref = props.api_details_ref
    // console.log('this.api_base_url: ',this.api_base_url)
    this.session = props.session;
    this.ethers = props.ethers;
    this.signer = props.signer_ref;
    this.creator_ref = props.creator_ref;
    this.signRedeemVoucher = props.signRedeemVoucher;
    this.claim = props.claim;
    console.log("create: session: ", this.session);
    const uuid_ = uuidv4();
    const partner_address = '0x0000000000000000000000000000000000000000'
    this.state = {
      confirm_code: false,
      confirm_msg: <p></p>,
      blockchain: "ethereum",
      price_eth: "",
      price_usd: "",
      social: "social_instagram",
      rid: uuid_,
      partner_address
    };
  }

  send_code = async (event) => {
    try {
      console.log("in send_code");
      event.preventDefault();
      if (!this.state.social_username) return alert("no username");
      if (!this.state.social) return alert("no social selection");
      const type_ = this.state.social.replace("social_", "");
      const username = this.state.social_username;
      const session = this.session.current;
      console.log("session: ", session);
      sendCode(this.api_details_ref.current.api_base_url, session, username, type_, this.state.rid);
    } catch (error) {
      console.log(error);
    }
  };
  confirm_code = async (event) => {
    try {
      console.log("in confirm_code");
      event.preventDefault();
      if (this.state.confirm_code) return alert("code already confirm");
      if (!this.state.social_code) return alert("no code");
      const code = parseInt(this.state.social_code);
      const session = this.session.current;
      const response = await confirmCode(this.api_details_ref.current.api_base_url, session, code);
      if (response) {
        this.setState({
          confirm_code: true,
          confirm_msg: <p style={{ color: "green" }}>code confirm</p>,
        });
      } else {
        console.log("wrong code");
        this.setState({
          confirm_code: false,
          confirm_msg: <p style={{ color: "red" }}>wrong code</p>,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  get_signed_url = async (key) => {
    try {
      console.log("in get_signed_url");
      const signed_url = await getSignedUrl(
        this.api_details_ref.current.api_base_url,
        this.session.current,
        this.state.rid,
        this.state[key].name,
        this.state[key].type,
        this.state[key]
      );
      return signed_url;
    } catch (error) {
      console.log(error);
    }
  };

  upload_file = async (event) => {
    try {
      event.preventDefault();
      const id_ = event.target.id;
      const key = id_.replace("button_", "");
      if (!this.state[key]) return alert(`no ${key} file`);
      const signed_url_response = await this.get_signed_url(key);
      if (!signed_url_response) return alert("failed signing url");
      const download_url = signed_url_response.data.results.downloadURL;
      const upload_url = signed_url_response.data.results.uploadURL;
      console.log("downloadURL: ", download_url);
      console.log("uploadURL: ", upload_url);
      await upload(upload_url, this.state[key].type, this.state[key]);
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = async (event) => {
    const id = event.target.id;
    if (["price_usd", "price_eth"].includes(id)) {
      const value = event.target.value ? parseFloat(event.target.value) : "";
      console.log("value: ", typeof value);
      if (value === "") return this.setState({ price_eth: "", price_usd: "" });
      const value_ = parseFloat(value);
      if (id === "price_usd") {
        const price_eth = value_ / 2000;
        this.setState({ [id]: value, price_eth });
      } else {
        const price_usd = value_ * 2000;
        this.setState({ [id]: value, price_usd });
      }
      return;
    }
    if (["video", "signature"].includes(id)) {
      const value = event.target.files[0];
      this.setState({ [id]: value });
      return;
    }
    const value = event.target.value;
    this.setState({ [id]: value });
    // const msg = `${id}: ${value}`;
    // console.log(msg);
  };

  gatherPreSignedData = ()=>{
    try {
      let price_eth = 0
      if (this.state.price_eth!=''){
        price_eth =  this.state.price_eth
      }
      const essentials = {
        'creator_address':this.creator_ref.current,
        'original_nft':this.state.original_nft,
        'partner_address':this.state.partner_address,
        'price':this.state.price,
        'price_eth':price_eth,
        'price_usd':this.state.price_usd,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
        // 'x':this.state.creator_address,
      }
      const invalid = []
      for (const [key,value] of Object.entries(essentials)){
        if (!value)invalid.push(`${key}`)
      }
      const response = {
        'valid':false,
        invalid
      }
      if (invalid.length)return response
      response.valid = true
      response.essentials = essentials
      return response
    } catch (error) {
      console.log(error)
    }
  }

  handle_create = async (event) => {
    try {
      event.preventDefault();
      console.log("in handle_create");
      const response = this.gatherPreSignedData()
      if (!response) return alert('error in gather')
      if (!response.valid)return alert('missing data: '+response.invalid.join(', '))
      console.log('rid ' + this.state.rid);
      const presigned_response = await getPreSignRedeemVoucher(
        this.state.rid,
        this.api_details_ref.current.api_base_url,
        this.session.current,
        response.essentials
      );
      if (!presigned_response) return alert("something went wrong");
      if (presigned_response.status !== 200)
        return alert("status code ", presigned_response.status);
      const results = presigned_response.data.results;
      // console.log("results: ", results);
      const signature = await this.signRedeemVoucher(this.signer.current,results)
      console.log("signature: ", signature);
      if (!signature)return alert('signature failed')
      console.log('rid: ',this.state.rid)
      console.log('session: ',this.session.current)
      const verify_response = await verifySignature(this.state.rid,this.api_details_ref.current.api_base_url,this.session.current,signature)
      if (!verify_response)return alert('verify failed')
      this.setState({ipfs_cid:verify_response.data.results.ipfs_cid})
      // console.log(verify_response)
    } catch (error) {
      console.log(error);
    }
  };

  handle_claim = async (event) => {
    try {
      event.preventDefault();
      console.log("in handle_claim");
      const ipfs_cid = this.state.ipfs_cid
      const claim_request_response = await claim_request(this.api_details_ref.current.api_base_url,this.session.current,ipfs_cid)
      if (!claim_request_response)return alert('cliam request failed')
      if (claim_request_response.status!==200)return alert('cliam request failed')
      const results = claim_request_response.data.results
      const claim_response = await this.claim(this.signer.current, this.ethers,results)
      console.log(claim_response)
    } catch (error) {
      console.log(error);
    }
  };

  check_address_ = async (event)=>{
    try {
      console.log('in check_address_')
      event.preventDefault();
      const id_ = event.target.id
      if (id_==='check_partner_address'){
        const address = this.state.partner_address
        console.log('event: ',event.target)
        console.log('address: ',address)
        const check_response = await check_address(this.api_details_ref.current.api_base_url,this.session.current,address)
        if (!check_response)return alert('failed check call')
        if (check_response.status!==200)return alert('failed check call')
        const check_partner_address = check_response.data.results.valid
        const check_partner_address_msg = check_partner_address?<div style={{color:"green"}}>valid</div>:<div style={{color:"red"}}>invalid</div>
        this.setState({check_partner_address,check_partner_address_msg})
        return
      }
      return alert('unknown id')
    } catch (error) {
      console.log(error)
    }
  }

  check_nfta = async (event)=>{
    try {
      console.log('in check_address_')
      event.preventDefault();
      const id_ = event.target.id
      if (id_==='check_original_nft'){
        const original_nft = this.state.original_nft
        console.log('event: ',event.target)
        console.log('original_nft: ',original_nft)
        const [sc,tokenId] = original_nft.split('/')
        const check_response = await checkNFT(this.api_details_ref.current.api_base_url, this.session.current,sc,tokenId)
        if (!check_response)return alert('failed check call')
        if (check_response.status!==200)return alert('failed check call')
        const check_original_nft = check_response.data.results.valid
        const check_original_nft_msg = check_original_nft?<div style={{color:"green"}}>valid</div>:<div style={{color:"red"}}>invalid</div>
        this.setState({check_original_nft,check_original_nft_msg})
        return
      }
      return alert('unknown id')
    } catch (error) {
      console.log(error)
    }
  }
//check_address


  componentDidUpdate() {
    console.log("in componentDidUpdate");
    console.log(this.state);
  }
  componentDidMount() {
    console.log("componentDidMount");
    console.log("this.session: ", this.session);
  }

  render() {
    // return (<div></div>)
    return (
      <div className="container-fluid">
        <form>
          <div className="container">
            <h3>01 Add Wallet</h3>
            <label htmlFor="original_nft">OriginalNFT:</label>{" "}
            <input
              onChange={this.handleChange}
              type="text"
              id="original_nft"
              name="original_nft"
            ></input>
            <button id="check_original_nft" onClick={this.check_nfta}>check</button>
            {this.state.check_original_nft_msg}
            <br></br>
            <label htmlFor="creator_address">Creator:</label>{" "}
            <input
              // onChange={this.handleChange}
              type="text"
              id="creator_address"
              name="creator_address"
              value={this.creator_ref.current}
              disabled
            ></input>
            <br></br>
            <label htmlFor="partner_address">Partner:</label>{" "}
            <input
              onChange={this.handleChange}
              type="text"
              id="partner_address"
              name="partner_address"
              value={this.state.partner_address}
            ></input>
            <button id="check_partner_address" onClick={this.check_address_}>check</button>
            {this.state.check_partner_address_msg}
          </div>
          <br></br>
          <div className="container">
            <h3>02 Price of the IMMA NFT</h3>
            <select onChange={this.handleChange} name="price" id="price">
              <option value="price_free">For Free</option>
              <option value="price_value">For A Price</option>
            </select>
            <br></br>
            <label htmlFor="price_eth">Price ETH </label>
            <input
              onChange={this.handleChange}
              type="number"
              id="price_eth"
              name="price_eth"
              key="price_eth"
              value={this.state.price_eth}
            ></input>
            <br></br>
            <label htmlFor="price_usd">Price USD </label>
            <input
              onChange={this.handleChange}
              type="number"
              id="price_usd"
              name="price_usd"
              key="price_usd"
              value={this.state.price_usd}
            ></input>
          </div>
          <div className="container">
            <h3>03 Network</h3>
            <label htmlFor="network">Blockchain network </label>

            <select
              onChange={this.handleChange}
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
              onChange={this.handleChange}
              type="file"
              id="video"
              name="video"
              key="video"
            ></input>
            <button id="button_video" onClick={this.upload_file}>
              upload video
            </button>
          </div>
          <div className="container">
            <h3>05 Your signature</h3>
            <label htmlFor="signature">Choose signature </label>
            <input
              onChange={this.handleChange}
              type="file"
              id="signature"
              name="signature"
              key="signature"
            ></input>
            <button id="button_signature" onClick={this.upload_file}>
              upload signature
            </button>
          </div>
          <div className="container">
            <h3>
              06 Enter a Twitter or Instagram username to verify your user
            </h3>

            {/* <label htmlFor="social">Blockchain network </label> */}
            <select onChange={this.handleChange} name="social" id="social">
              <option value="social_instagram">Instagram</option>
              <option value="social_twitter">Twitter</option>
            </select>
            <br></br>
            <label htmlFor="social_username">social sername </label>
            <input
              onChange={this.handleChange}
              type="text"
              id="social_username"
              name="social_username"
              key="social_username"
            ></input>
            <button
              id="send_code"
              name="send_code"
              key="send_code"
              onClick={this.send_code}
            >
              send code
            </button>
            <br></br>
            <input
              onChange={this.handleChange}
              type="number"
              id="social_code"
              name="social_code"
              key="social_code"
            ></input>
            <button
              id="submit_code"
              name="submit_code"
              key="submit_code"
              onClick={this.confirm_code}
            >
              sumbit code
            </button>
            <br></br>
            {this.state.confirm_msg}
          </div>
          <div className="container">
            <h3>Create IMMA NFT</h3>
            <button
              id="create_nft"
              name="create_nft"
              key="create_nft"
              onClick={this.handle_create}
            >
              Create
            </button>
            <br></br>
            {this.state.ipfs_cid}
          </div>
          <br></br>
          <div className="container">
            <h3>TestClaim</h3>
            <button
              id="test_claim"
              name="test_claim"
              key="test_claim"
              value='bafybeidvuzr7mzfz6vtga622rjjrlftwsgmjnm6wbjh2ahcdh6rx5qnpya'
              onClick={this.handle_claim}
            >
              Claim
            </button>
          </div>

        </form>
      </div>
    );
  }
}

const axios = require('axios');

const axios_call = async (payload) => {
    console.log('axios: ', payload)
    return await axios(payload)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}

const sendCode = async (api_base_url, session, username, type_, rid) => {
    try {
        const FormData = require('form-data');
        const data = new FormData();

        data.append('type', type_);
        data.append('username', username);
        data.append('rid', rid);
        const config = {
            method: 'post',
            url: `${api_base_url}/sendCode`,
            headers: {
                session,
            },
            data: data
        };
        await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}

const verifySignature  = async (rid,api_base_url, session,signature)=>{
    try {
        console.log('in verifySignature')
        const FormData = require('form-data');
        const data = new FormData();
         data.append('rid', rid);
         data.append('signature', signature);
        const config = {
            method: 'post',
            url: `${api_base_url}/verifySignature`,
            headers: {
                session,
            },
            data: data
        };
        const res = await axios_call(config)
        console.log('verifySignature: ',res.status)
        return res
    } catch (error) {
        console.log(error.message)
    }
}

const getPreSignRedeemVoucher = async (rid,api_base_url, session,essentials) => {
    try {
        const FormData = require('form-data');
        const data = new FormData();
        data.append('rid', rid);
        data.append('essentials',JSON.stringify(essentials))
        const config = {
            method: 'post',
            url: `${api_base_url}/getPreSignRedeemVoucher`,
            headers: {
                session,
            },
            data: data
        };
        return await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}

const claim_request = async (api_base_url, session,ipfs_cid)=>{
    try {
        const params = {
            ipfs_cid
        }
        const config = {
            method: 'get',
            url: `${api_base_url}/claim`,
            headers: {
                session,
            },
            params
        };
        return await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}

const check_address = async (api_base_url, session,address)=>{
    try {
        const FormData = require('form-data');
        const data = new FormData();
        data.append('address', address);
        const config = {
            method: 'post',
            url: `${api_base_url}/checkAddress`,
            headers: {
                session,
            },
            data: data
        };
        return await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}

const checkNFT = async (api_base_url, session,sc,tokenId)=>{
    try {
        const FormData = require('form-data');
        const data = new FormData();
        data.append('sc', sc);
        data.append('tokenId', tokenId);
        const config = {
            method: 'post',
            url: `${api_base_url}/checkNFT`,
            headers: {
                session,
            },
            data: data
        };
        return await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}


const confirmCode = async (api_base_url, session, code) => {
    try {
        const FormData = require('form-data');
        const data = new FormData();
        data.append('code', code);
        const config = {
            method: 'post',
            url: `${api_base_url}/confirmCode`,
            headers: {
                session,
            },
            data: data
        };
        const confirm_response = await axios_call(config)
        //  console.log('confirm_response: ',confirm_response)
        return confirm_response.status === 200
    } catch (error) {
        console.log(error)
    }
}
const getSignedUrl = async (api_base_url, session, rid, filename, ct, data) => {
    try {
        const url = `${api_base_url}/getSignedUrl`
        const params = {
            rid,
            filename,
            ct
        }
        const config = {
            method: 'get',
            url,
            headers: {
                session,
            },
            params,
            data,
        };
        return await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}

const upload = async (url, ct, data) => {
    try {
        const config = {
            method: 'put',
            url,
            headers: {
                ct,
            },
            data,
        };
        return await axios_call(config)
    } catch (error) {
        console.log(error)
    }
}

export {
    confirmCode,
    getSignedUrl,
    upload,
    sendCode,
    getPreSignRedeemVoucher,
    verifySignature,
    claim_request,
    check_address,
    checkNFT
} 
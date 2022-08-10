import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const axios_call = async (payload) => {
	return await axios(payload)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
};

export const getSignedUrl = async (rid, filename, ct, url) => {
	try {
		const params = {
			rid,
			filename,
			ct
		};
		var config = {
			method: 'get',
			url: url,
			headers: {
				'Content-Type': 'text/plain'
			},
			params
		};

		return await axios_call(config);
	} catch (error) {
		console.log(error);
	}
};

const downloadDemoFile = async (type, url) => {
	try {
		var config = {
			responseType: 'blob', // notice blob
			method: 'get',
			url,
			headers: {}
		};
		const response = await axios_call(config);
		const blob = response.data;
		//or you can convert any other bytes to blob
		// const blob2 = new Blob([blob], { type });
		return blob;
	} catch (error) {
		console.log(error);
	}
};

export const uploads3 = async (url, ct, blob, setVideoProgress) => {
	try {
		const config = {
			method: 'put',
			url,
			headers: {
				'Content-Type': ct
			},
			onUploadProgress: (progressEvent) => {
				setVideoProgress(Math.round(progressEvent.loaded*(100/blob.size)));
				console.log(progressEvent.loaded);
			},
			data: blob
		};

		return await axios_call(config);
	} catch (error) {
		console.log(error);
	}
};

export const downloadTest = async (url) => {
	try {
		const config = {
			method: 'get',
			url
		};
		const response = await axios_call(config);

		console.log(response);

		return response;
	} catch (error) {
		console.log(error);
	}
};

/*export const UploadTest = async (video, rid, ct, filename, getSignedURL) => {
	try {
		console.log('rid: ', rid);

		const signed_respone = await getSignedUrl(rid, filename, ct, getSignedURL);
		const results = signed_respone.data.results;
		const uploadURL = results.uploadURL;
		const downloadURL = results.downloadURL;
		const upload_reponse = await uploads3(uploadURL, ct, video);

		console.log('upload_reponse: ', upload_reponse);

		const download_response = await downloadTest(downloadURL);
		const sum = {
			upload_reponse: upload_reponse.status,
			download_response: download_response.status
		};

		console.log(sum);
		console.log('paste in browser for additional test: ');
		console.log(downloadURL);
	} catch (error) {
		console.log(error);
	}
};*/

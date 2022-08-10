import React, { useState, useRef, useEffect } from 'react';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { downloadTest, uploads3 } from '../api/VideoUpload';

// Check for getUserMedia() API availability in current browser
function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function wait(delayInSec) {
	return new Promise((resolve) => setTimeout(resolve, delayInSec * 1000));
}

interface ICreationVideo {
	dispatch: React.Dispatch<any>;
}

type ConfigT = {
	method: 'get' | 'post' | 'put';
	url: string;
	headers?: any;
	body?: Blob;
};

type ContentType = 'video/mp4' | 'image/jpeg' | 'image/gif' | 'image/png';

export const CreationVideo = ({ dispatch }: ICreationVideo) => {
	const videoRef = useRef(null);
	const mediaRef = useRef(null);
	const playButton = useRef(null);
	const pauseButton = useRef(null);

	const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [recorder, setRecorder] = useState<null | MediaRecorder>(null);
	const [recorderState, setRecorderState] = useState<'recording' | 'inactive'>('inactive');
	const [video, setVideo] = useState<null | Blob>(null);
	const [videoApproved, setVideoApproved] = useState<boolean>(false);
	const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
	const [videoProgress, setVideoProgress] = useState<number>(0);

	// Params for signedUrlData query.
	// Maybe not necessary use useState for them
	const [rid, setRid] = useState<string>(uuidv4());
	const [filename, setFilename] = useState<string>('MyVideo.mp4');
	const [contentType, setContentType] = useState<ContentType>('video/mp4');

	const [signedUrlData, setSignedUrlData] = useState(null);

	useEffect(() => {
		if (videoProgress === 100 && isModalOpened) {
			setTimeout(() => closeVideoModal(), 1000);
		}
	}, [videoProgress])

	// Gets signedUrlData
	useEffect(() => {
		const config: ConfigT = {
			method: 'get',
			url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getSignedUrl?rid=${rid}&filename=${filename}&ct=${contentType}`,
			headers: {
				// origin: 'imma_postman',
				'Content-Type': 'video/mp4'
			}
		};
		axios(config)
			.then((response) => {
				setSignedUrlData(response.data.results);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		if (stream) {
			const recorder: MediaRecorder = new MediaRecorder(stream);
			setRecorder(recorder);
		}
	}, [stream]);

	// Video save & upload
	useEffect(() => {
		if (videoApproved && video && signedUrlData) {
			/*video.name = filename;
			video.type = contentType;*/
			dispatch({ type: 'SET_VIDEO', value: video });
			console.log("video.size" + video.size);
			uploads3(signedUrlData.uploadURL, contentType, video, setVideoProgress).then((response) => {
				if (response.status === 200) {
					console.log('video upload is successful');
					setVideoUploaded(true);
				}
			});

		}
	}, [videoApproved]);

	// Download video to be sure that video uploaded correctly
	useEffect(() => {
		if (videoUploaded && signedUrlData) {
			console.log('downloading video...');

			async function downloadVideo() {
				const downloadResponse = await downloadTest(signedUrlData.downloadURL);

				const downloadResponseStatus = downloadResponse.status;
				console.log(downloadResponseStatus);
			}

			downloadVideo();
		}
	}, [videoUploaded]);

	const createVideo = (): void => {
		if (!hasGetUserMedia()) {
			/* alert('getUserMedia() is not supported by your browser')*/;
		}


		// alert('stream');

		// Disables scroll (fixes the screen)
		const htmlEl = document.documentElement;
		htmlEl.classList.add('is-locked');

		setVideoProgress(0);
		setIsModalOpened(true);

		const getMedia = async (constraints) => {
			console.log('get media');
			const video: HTMLVideoElement = mediaRef.current;

			let stream: null | MediaStream = null;

			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints);
				video.srcObject = stream;
				setStream(stream);
			} catch (err) {
				// alert('stream error');
				console.log(err);
			}
		};

		// Options for media stream
		const hdConstraints = {
			audio: false,
			video: true//{ width: { min: 0 }, height: { min: 0 }, facingMode: 'user' }
		};

		getMedia(hdConstraints);
	};

	const handleRecord = (): void => {
		// Function to record a video useing getUserMedia API
		function startRecording(recorder: MediaRecorder, lengthInSec: number): Promise<Blob[]> {
			const data: Array<null | Blob> = [];

			recorder.ondataavailable = (event) => data.push(event.data);

			const stopped = new Promise((resolve, reject) => {
				recorder.onstop = () => resolve(data);
				recorder.onerror = (event) => reject(event);
			});

			if (recorder.state === 'recording') {
				recorder.stop();
				setRecorderState('inactive');

				return Promise.all([stopped]).then(() => data);
			}

			recorder.start();
			setRecorderState('recording');

			const recorded = wait(lengthInSec).then(
				() => recorder.state == 'recording' && recorder.stop()
			);

			return Promise.all([stopped, recorded]).then(() => data);
		}

		// Blob array with recorded video
		// (60 * 5 means that max video length is 5 minutes)
		const videosArr: Promise<Blob[]> = startRecording(recorder, 60 * 5);

		videosArr.then((videos) => setVideo(videos[0]));
	};

	const closeVideoModal = (): void => {
		setVideoProgress(0);
		if (recorderState === 'recording') {
			recorder.stop();
			setRecorderState('inactive');
		}
		// Enables scroll
		const htmlEl = document.documentElement;
		htmlEl.classList.remove('is-locked');

		setIsModalOpened(false);

		if (stream) {
			const streamTracks: Array<MediaStreamTrack> = stream.getTracks();

			streamTracks.forEach((track) => track.stop());
		}

		setStream(null);
	};

	const discardVideo = (modal): void => {
		setVideoProgress(0);
		setVideoApproved(false);
		if (modal) {
			createVideo();
		}
		videoRef.current.pause();
		if (playButton.current) {
			playButton.current.style.display = "block";
		}
		if (video) {
			setVideo(null);
			dispatch({ type: 'SET_VIDEO', value: null });
		} else if (recorderState === 'recording') {
			recorder.stop();
			setRecorderState('inactive');
		}
	};

	const approveVideo = () => {
		videoRef.current.pause();
		setVideoApproved(true);
		//closeVideoModal();
	};

	return (
		<>
			<div className="step-wrapper step-wrapper_video">
				<div className="step-wrapper_video-buttons">
					<button type="button" className={`btn-video ${video ? 'btn-video-uploaded' : ''}`} onClick={createVideo}>
						{!video ? 'Create a video' : 'Video uploaded'}
					</button>
					{video ?
					<button
						type="button"
						className="step-wrapper_video__btn_refuse"
						onClick={() => discardVideo(true)}
					>
						<svg width="12" height="15" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 21.7471C6.61406 21.7438 4.32678 20.7945 2.63967 19.1074C0.952551 17.4203 0.00328416 15.133 0 12.7471C7.35896e-09 12.5001 0.0980907 12.2633 0.272694 12.0887C0.447296 11.9141 0.684109 11.816 0.931034 11.816C1.17796 11.816 1.41477 11.9141 1.58938 12.0887C1.76398 12.2633 1.86207 12.5001 1.86207 12.7471C1.86207 14.1588 2.2807 15.5389 3.06503 16.7127C3.84935 17.8865 4.96415 18.8014 6.26843 19.3417C7.57272 19.8819 9.00792 20.0233 10.3925 19.7478C11.7772 19.4724 13.049 18.7926 14.0473 17.7943C15.0455 16.7961 15.7254 15.5242 16.0008 14.1396C16.2762 12.755 16.1348 11.3198 15.5946 10.0155C15.0543 8.71122 14.1394 7.59642 12.9656 6.8121C11.7918 6.02777 10.4117 5.60914 9 5.60914H5.89655C5.64963 5.60914 5.41281 5.51105 5.23821 5.33645C5.06361 5.16184 4.96552 4.92503 4.96552 4.6781C4.96552 4.43118 5.06361 4.19437 5.23821 4.01976C5.41281 3.84516 5.64963 3.74707 5.89655 3.74707H9C11.3869 3.74707 13.6761 4.69528 15.364 6.38311C17.0518 8.07094 18 10.3601 18 12.7471C18 15.134 17.0518 17.4232 15.364 19.111C13.6761 20.7989 11.3869 21.7471 9 21.7471Z" fill="#D6FF7E"/>
							<path d="M9.00006 9.33357C8.87773 9.33415 8.75652 9.31029 8.64354 9.26339C8.53056 9.21649 8.42808 9.1475 8.34213 9.06046L4.61799 5.33633C4.44364 5.16176 4.3457 4.92512 4.3457 4.6784C4.3457 4.43167 4.44364 4.19503 4.61799 4.02047L8.34213 0.296328C8.42736 0.204854 8.53015 0.131486 8.64435 0.0805996C8.75856 0.029713 8.88185 0.00235056 9.00686 0.000144895C9.13187 -0.00206077 9.25604 0.0209353 9.37197 0.0677614C9.4879 0.114588 9.59321 0.184284 9.68162 0.272694C9.77003 0.361103 9.83973 0.466414 9.88655 0.582345C9.93338 0.698275 9.95638 0.822449 9.95417 0.947459C9.95196 1.07247 9.9246 1.19576 9.87372 1.30996C9.82283 1.42417 9.74946 1.52695 9.65799 1.61219L6.59178 4.6784L9.65799 7.7446C9.83234 7.91917 9.93027 8.15581 9.93027 8.40253C9.93027 8.64926 9.83234 8.8859 9.65799 9.06046C9.57203 9.1475 9.46955 9.21649 9.35657 9.26339C9.24359 9.31029 9.12238 9.33415 9.00006 9.33357Z" fill="#D6FF7E"/>
						</svg>
					</button>
					: ''}
				</div>
				<span>
					*there is only an option to shoot something at the moment, there is no option to
					upload anything from the gallery
				</span>
			</div>
			<div className="video-modal" style={!isModalOpened ? { display: 'none' } : null}>
				<div className="video-modal-wrapper">
					<h2 className="title title_size-m video-modal__title">Create a video</h2>
					<div className="video-modal__screen">
						<div className="video-modal__top-buttons-wrapper">
							<h2 className="title title_size-m video-modal__title mobile-title">Create a video</h2>
							<button
								type="button"
								className="video-modal__close"
								aria-label="close"
								onClick={closeVideoModal}
							>
								<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0.78418 0.78418L10.6607 10.6609M10.6607 0.78418L0.78418 10.6607" stroke="white" strokeWidth="1.49135" strokeLinecap="round"/>
								</svg>
							</button>
							<button
								type="button"
								className={`video-modal__approve ${video ? 'active' : ''}`}
								aria-label="approve"
								onClick={video ? approveVideo : null}
							>
								<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1.2002 3.68178L5.87202 8.35378L13.1352 1.09058" stroke="#828282" strokeWidth="1.49135" strokeLinecap="round"/>
								</svg>
							</button>
						</div>
						<video
							className="video-modal__video"
							width="540"
							height="660"
							autoPlay={true}
							ref={mediaRef}
							style={video ? { display: 'none' } : { display: 'block' }}
						></video>
						<video
							className="video-modal__video"
							width="540"
							height="660"
							autoPlay={false}
							src={video ? URL.createObjectURL(video) : null}
							ref={videoRef}
							style={video ? { display: 'block' } : { display: 'none' }}
							onEnded={() => videoRef.current.play()}
						>
							Your browser doesn't support video tag
						</video>
						<div className="video-modal__control">
							{video ? (
								<>
									<button
										type="button"
										className="video-modal__control-btn video-modal__control-btn_approve"
										onClick={() => {
												if (videoRef.current.paused) {
														videoRef.current.play();
														playButton.current.style.display = "none";
														pauseButton.current.style.display = "block";
												} else {
														videoRef.current.pause();
														playButton.current.style.display = "block";
														pauseButton.current.style.display = "none";
												}
											}
										}
									>
									<svg className="video-modal__control-btn_play" ref={playButton} width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M0.399902 9.2998V2.4083C0.399902 0.837429 2.12781 -0.120255 3.4599 0.712305L14.4863 7.60381C15.7396 8.38714 15.7396 10.2125 14.4863 10.9958L3.4599 17.8873C2.1278 18.7199 0.399902 17.7622 0.399902 16.1913V9.2998Z" fill="#D6FF7E"/>
									</svg>
									<svg className="video-modal__control-btn_pause" ref={pauseButton} width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
										<rect x="0.0820312" y="0.619629" width="3.46223" height="20.7734" rx="1.15408" fill="#D6FF7E"/>
										<rect x="9.31445" y="0.619629" width="3.46223" height="20.7734" rx="1.15408" fill="#D6FF7E"/>
									</svg>
									</button>
									<button
										type="button"
										className="video-modal__control-btn video-modal__control-btn_refuse"
										onClick={discardVideo}
									>
										<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M9 21.7471C6.61406 21.7438 4.32678 20.7945 2.63967 19.1074C0.952551 17.4203 0.00328416 15.133 0 12.7471C7.35896e-09 12.5001 0.0980907 12.2633 0.272694 12.0887C0.447296 11.9141 0.684109 11.816 0.931034 11.816C1.17796 11.816 1.41477 11.9141 1.58938 12.0887C1.76398 12.2633 1.86207 12.5001 1.86207 12.7471C1.86207 14.1588 2.2807 15.5389 3.06503 16.7127C3.84935 17.8865 4.96415 18.8014 6.26843 19.3417C7.57272 19.8819 9.00792 20.0233 10.3925 19.7478C11.7772 19.4724 13.049 18.7926 14.0473 17.7943C15.0455 16.7961 15.7254 15.5242 16.0008 14.1396C16.2762 12.755 16.1348 11.3198 15.5946 10.0155C15.0543 8.71122 14.1394 7.59642 12.9656 6.8121C11.7918 6.02777 10.4117 5.60914 9 5.60914H5.89655C5.64963 5.60914 5.41281 5.51105 5.23821 5.33645C5.06361 5.16184 4.96552 4.92503 4.96552 4.6781C4.96552 4.43118 5.06361 4.19437 5.23821 4.01976C5.41281 3.84516 5.64963 3.74707 5.89655 3.74707H9C11.3869 3.74707 13.6761 4.69528 15.364 6.38311C17.0518 8.07094 18 10.3601 18 12.7471C18 15.134 17.0518 17.4232 15.364 19.111C13.6761 20.7989 11.3869 21.7471 9 21.7471Z" fill="#D6FF7E"/>
											<path d="M9.00006 9.33357C8.87773 9.33415 8.75652 9.31029 8.64354 9.26339C8.53056 9.21649 8.42808 9.1475 8.34213 9.06046L4.61799 5.33633C4.44364 5.16176 4.3457 4.92512 4.3457 4.6784C4.3457 4.43167 4.44364 4.19503 4.61799 4.02047L8.34213 0.296328C8.42736 0.204854 8.53015 0.131486 8.64435 0.0805996C8.75856 0.029713 8.88185 0.00235056 9.00686 0.000144895C9.13187 -0.00206077 9.25604 0.0209353 9.37197 0.0677614C9.4879 0.114588 9.59321 0.184284 9.68162 0.272694C9.77003 0.361103 9.83973 0.466414 9.88655 0.582345C9.93338 0.698275 9.95638 0.822449 9.95417 0.947459C9.95196 1.07247 9.9246 1.19576 9.87372 1.30996C9.82283 1.42417 9.74946 1.52695 9.65799 1.61219L6.59178 4.6784L9.65799 7.7446C9.83234 7.91917 9.93027 8.15581 9.93027 8.40253C9.93027 8.64926 9.83234 8.8859 9.65799 9.06046C9.57203 9.1475 9.46955 9.21649 9.35657 9.26339C9.24359 9.31029 9.12238 9.33415 9.00006 9.33357Z" fill="#D6FF7E"/>
										</svg>
									</button>
								</>
							) : (
								<>
									<button
										type="button"
										className="video-modal__control-btn video-modal__control-btn_record"
										aria-label={
											recorderState === 'recording' ? 'stop' : 'record'
										}
										onClick={handleRecord}
										disabled={stream ? false : true}
									>
										{recorderState === 'recording' ?
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect width="20" height="20" fill="#D6FF7E"/>
											</svg>
											:
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<circle cx="9.96001" cy="9.96147" r="9.83452" fill="#D6FF7E"/>
											</svg>
										}
									</button>
									{recorderState === 'recording' ?
										<button
											type="button"
											className="video-modal__control-btn video-modal__control-btn_discard"
											aria-label="discard"
											onClick={discardVideo}
											disabled={stream ? false : true}
										>
										<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M9 21.7471C6.61406 21.7438 4.32678 20.7945 2.63967 19.1074C0.952551 17.4203 0.00328416 15.133 0 12.7471C7.35896e-09 12.5001 0.0980907 12.2633 0.272694 12.0887C0.447296 11.9141 0.684109 11.816 0.931034 11.816C1.17796 11.816 1.41477 11.9141 1.58938 12.0887C1.76398 12.2633 1.86207 12.5001 1.86207 12.7471C1.86207 14.1588 2.2807 15.5389 3.06503 16.7127C3.84935 17.8865 4.96415 18.8014 6.26843 19.3417C7.57272 19.8819 9.00792 20.0233 10.3925 19.7478C11.7772 19.4724 13.049 18.7926 14.0473 17.7943C15.0455 16.7961 15.7254 15.5242 16.0008 14.1396C16.2762 12.755 16.1348 11.3198 15.5946 10.0155C15.0543 8.71122 14.1394 7.59642 12.9656 6.8121C11.7918 6.02777 10.4117 5.60914 9 5.60914H5.89655C5.64963 5.60914 5.41281 5.51105 5.23821 5.33645C5.06361 5.16184 4.96552 4.92503 4.96552 4.6781C4.96552 4.43118 5.06361 4.19437 5.23821 4.01976C5.41281 3.84516 5.64963 3.74707 5.89655 3.74707H9C11.3869 3.74707 13.6761 4.69528 15.364 6.38311C17.0518 8.07094 18 10.3601 18 12.7471C18 15.134 17.0518 17.4232 15.364 19.111C13.6761 20.7989 11.3869 21.7471 9 21.7471Z" fill="#D6FF7E"/>
											<path d="M9.00006 9.33357C8.87773 9.33415 8.75652 9.31029 8.64354 9.26339C8.53056 9.21649 8.42808 9.1475 8.34213 9.06046L4.61799 5.33633C4.44364 5.16176 4.3457 4.92512 4.3457 4.6784C4.3457 4.43167 4.44364 4.19503 4.61799 4.02047L8.34213 0.296328C8.42736 0.204854 8.53015 0.131486 8.64435 0.0805996C8.75856 0.029713 8.88185 0.00235056 9.00686 0.000144895C9.13187 -0.00206077 9.25604 0.0209353 9.37197 0.0677614C9.4879 0.114588 9.59321 0.184284 9.68162 0.272694C9.77003 0.361103 9.83973 0.466414 9.88655 0.582345C9.93338 0.698275 9.95638 0.822449 9.95417 0.947459C9.95196 1.07247 9.9246 1.19576 9.87372 1.30996C9.82283 1.42417 9.74946 1.52695 9.65799 1.61219L6.59178 4.6784L9.65799 7.7446C9.83234 7.91917 9.93027 8.15581 9.93027 8.40253C9.93027 8.64926 9.83234 8.8859 9.65799 9.06046C9.57203 9.1475 9.46955 9.21649 9.35657 9.26339C9.24359 9.31029 9.12238 9.33415 9.00006 9.33357Z" fill="#D6FF7E"/>
										</svg>
										</button>
										:
										''
									}
								</>
							)}
						</div>
						<div className={`video-modal__upload-bar-wrap ${videoProgress ? 'active-video-wrap' : ''}`}>
							{videoProgress ? <div className="video-modal__upload-bar" style={{width: videoProgress + '%'}}></div> : ''}
						</div>
						<div className="video-modal__upload-bar-text">
							{videoProgress ? (`Loading: ${videoProgress}%`) : ''}
						</div>
					</div>
				</div>
			</div>
			<div className="bg-blur" style={!isModalOpened ? { display: 'none' } : null}></div>
		</>
	);
};

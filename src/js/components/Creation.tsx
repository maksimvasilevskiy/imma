import React, { useReducer, useState, useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';
import { State, reducer } from '../helpers/creationReducer';
import { CreationStep } from './CreationStep';
import { CreationForm } from './CreationForm';
import { CreationVideo } from './CreationVideo';
import { CreationSubmit } from './CreationSubmit';
import { PriceRadio, BlockchainRadio, SocialRadio } from './CreationRadio';

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
		isFree: true,
		dollarValue: 391.34,
		ethereumValue: 0.14
	},
	blockchain: 'ethereum',
	video: null,
	signature: null,
	verification: {
		social: 'instagram',
		isVerified: false
	}
};

export const Creation = () => {
	const signFieldRef = useRef(null);

	const [state, dispatch] = useReducer(reducer, initialState);
	const [signatureText, setSignatureText] = useState<string>('Sign here');
	const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

	useEffect(() => {
		const windowWidth = window.innerWidth;

		if (windowWidth < 768) {
			setSignatureText('Put your signature here');
		} else {
			setSignatureText('Sign here');
		}
	}, [window.innerWidth]);

	// TODO: Save signature when submiting creation form
	// (signaturePad.toDataURL("image/svg+xml"))
	const enableSignaturePad = (): void => {
		const canvas: HTMLCanvasElement = signFieldRef.current;

		// Inits signature pad
		if (!signaturePad) {
			function resizeCanvas(): void {
				var ratio = Math.max(window.devicePixelRatio || 1, 1);
				canvas.width = canvas.offsetWidth * ratio;
				canvas.height = canvas.offsetHeight * ratio;
				canvas.getContext('2d').scale(ratio, ratio);
			}

			window.onresize = resizeCanvas;
			resizeCanvas();

			const signaturePad = new SignaturePad(canvas, {
				penColor: 'rgb(255, 255, 255)'
			});

			setSignaturePad(signaturePad);
		} else {
			signaturePad.clear();
		}
	};

	const createVideo = (): void => {
		const getMedia = async (constraints) => {
			let stream: null | MediaStream = null;

			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints);

				console.log(stream);
				/* use the stream */
			} catch (err) {
				console.log(err);
				/* handle the error */
			}
		};

		getMedia({ audio: true, video: true });
	};

	return (
		<section id="creation" className="section creation">
			<div className="section-wrapper creation-wrapper">
				<div className="container">
					<h2 className="title title_size-m creation-title">IMMA NFT creation</h2>
					<CreationStep number="01" title="Add wallet">
						<div className="step-wrapper">
							<CreationForm
								title="Original NFT for your imma NFT to follow"
								state={state}
								dispatch={dispatch}
								wallet="original"
							/>
							<CreationForm
								title="The imma NFT creator wallet"
								state={state}
								dispatch={dispatch}
								wallet="creator"
							/>
							{state.wallets.customWallet && (
								<CreationForm
									title="Broke wallet"
									state={state}
									dispatch={dispatch}
									wallet="custom"
								/>
							)}
							{!state.wallets.customWallet && (
								<div className="step-block_add">
									<button
										type="button"
										className="step-block__add-btn"
										onClick={() => dispatch({ type: 'ADD_CUSTOM_WALLET' })}
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
							<PriceRadio isFree={true} price={state.price} dispatch={dispatch} />
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
						<CreationVideo />
					</CreationStep>
					<CreationStep number="05" title="Your signature">
						<div className="step-wrapper">
							<div className="step-block_sign">
								<div
									className="step-block__sign step-block__sign_active"
									style={
										signaturePad ? { display: 'none' } : { display: 'block' }
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
											stroke-linecap="round"
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
							/>
							<SocialRadio
								type="twitter"
								verification={state.verification}
								dispatch={dispatch}
							/>
						</div>
						<form className="step-code" action="">
							<label>
								Enter the code
								<div className="step-code__input-wrapper">
									<input className="input" type="text" name="social_code" />
									<button className="btn step-code__submit" type="submit">
										Submit
									</button>
								</div>
							</label>
						</form>
					</CreationStep>
					<CreationSubmit state={state} dispatch={dispatch} />
				</div>
			</div>
		</section>
	);
};

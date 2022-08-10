import React, { useState, useEffect } from 'react';
import { State } from '../helpers/creationReducer';

type ProgressItem = 'current' | 'completed' | 'staging';

type ProgressItemT = {
	id: number;
	state: ProgressItem;
};

const initialProgressBar: ProgressItemT[] = [
	{
		id: 1,
		state: 'current'
	},
	{
		id: 2,
		state: 'staging'
	},
	{
		id: 3,
		state: 'staging'
	},
	{
		id: 4,
		state: 'staging'
	},
	{
		id: 5,
		state: 'staging'
	},
	{
		id: 6,
		state: 'staging'
	},
	{
		id: 7,
		state: 'staging'
	}
];

type ProgressBarProps = {
	state: State;
	containerRef: React.RefObject<HTMLElement>;
};

export const ProgressBar = ({ state, containerRef }: ProgressBarProps) => {
	const [visible, setVisible] = useState<boolean>(false);
	const [progressItems, setProgressItems] = useState<ProgressItemT[]>(initialProgressBar);
	const [appearingScroll, setAppearingScroll] = useState<number>(1000);
	const [disappearingScroll, setDisappearingScroll] = useState<number>(1500);

	// (Will be in Creation component, I think)
	const [progress, setProgress] = useState<number>(30); // 0% - 100%

	useEffect(() => {
		// The thing is - this code runs after list render (maybe)
		let progress: number = 0;
		let newProgressItems: ProgressItemT[] = initialProgressBar.concat();

		if (state) {
			// First step of the bar
			const checkPartnerWalet = state.hasPartnerWallet ? (state.partnerWalletVerified ? true : false) : true;
			if (state.creatorWalletVerified && state.originalNftVerified && checkPartnerWalet) {
				progress = 8;
				newProgressItems[0] = { id: 1, state: 'completed' };
			}

			// Second step of the bar
			if (state.price.isFree !== null) {
				progress = 22;
				newProgressItems[1] = { id: 2, state: 'completed' };
			}

			// Third step of the bar
			if (state.blockchain) {
				progress = 40;
				newProgressItems[2] = { id: 3, state: 'completed' };
			}

			// Forth step of the bar
			if (state.video) {
				progress = 56;
				newProgressItems[3] = { id: 4, state: 'completed' };
			}

			// Fifth step of the bar
			if (state.signature && state.signature.size != 3172) {
				progress = 70;
				newProgressItems[4] = { id: 5, state: 'completed' };
			}

			// Sixth step of the bar
			if (state.verification.isVerified) {
				progress = 90;
				newProgressItems[5] = { id: 6, state: 'completed' };
			}

			// Check is all steps are checked
		}

		setProgress(progress);
		setProgressItems(newProgressItems);
	}, [state]);

	useEffect(() => {
		const container: HTMLElement = containerRef.current;

		if (container) {
			const containerParams: DOMRect = container.getBoundingClientRect();

			const topRange: number = container.offsetTop + window.innerHeight / 2;
			const bottomRange: number = container.offsetTop + containerParams.height;

			console.log(topRange, bottomRange);

			setAppearingScroll(topRange);
			setDisappearingScroll(bottomRange);
		}
	}, [containerRef]);

	const handleScroll = (): void => {
		const currentScroll: number = window.scrollY;

		if (currentScroll >= appearingScroll && currentScroll <= disappearingScroll) {
			setVisible(true);
		} else {
			setVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('scroll', handleScroll);
		return () => document.removeEventListener('scroll', handleScroll);
	}, [disappearingScroll]);

	return (
		<div className={`progress-bar ${visible ? 'progress-bar_visible' : null}`}>
			<div className="progress-bar__wrapper">
				<div className="progress-bar__back-bar">
					<div className="progress-bar__bar" style={{ height: `${progress}%` }}></div>
				</div>
				<ol className="progress-bar__steps">
					{progressItems.map((item, idx) => {
						if (progressItems[progressItems.length - 1] === item) {
							return (
								<li className="progress-bar__step" key={item.id}>
									<div
										className="progress-bar__step_final"
										style={
											progress === 100 ? { opacity: '1' } : { opacity: '0.2' }
										}
									>
										<svg
											width="31"
											height="31"
											viewBox="0 0 31 31"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle
												cx="15.1504"
												cy="15.7727"
												r="15"
												fill="#D6FF7E"
											/>
											<path
												d="M10.082 15.4811L13.6553 19.0541L20.2176 12.4917"
												stroke="black"
												strokeWidth="2"
											/>
										</svg>
									</div>
								</li>
							);
						}

						return (
							<li className="progress-bar__step" key={item.id}>
								{item.state === 'current' && (
									<div className="progress-bar__step_current">
										<svg
											width="28"
											height="28"
											viewBox="0 0 28 28"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M27.6879 13.7727C27.6879 21.271 21.6093 27.3495 14.111 27.3495C6.61275 27.3495 0.53418 21.271 0.53418 13.7727C0.53418 6.27437 6.61275 0.195801 14.111 0.195801C21.6093 0.195801 27.6879 6.27437 27.6879 13.7727Z"
												fill="white"
												fillOpacity="0.2"
											/>
											<path
												d="M16.6504 13.7727C16.6504 15.1534 15.5311 16.2727 14.1504 16.2727C12.7697 16.2727 11.6504 15.1534 11.6504 13.7727C11.6504 12.392 12.7697 11.2727 14.1504 11.2727C15.5311 11.2727 16.6504 12.392 16.6504 13.7727Z"
												fill="white"
											/>
										</svg>
										<span>{idx < 9 ? `0${idx + 1}` : `${idx + 1}`}</span>
									</div>
								)}
								{item.state === 'staging' && (
									<div className="progress-bar__step_staging">
										<svg
											width="6"
											height="6"
											viewBox="0 0 6 6"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.65039 2.67285C5.65039 4.05356 4.5311 5.17285 3.15039 5.17285C1.76968 5.17285 0.650391 4.05356 0.650391 2.67285C0.650391 1.29214 1.76968 0.172852 3.15039 0.172852C4.5311 0.172852 5.65039 1.29214 5.65039 2.67285Z"
												fill="white"
											/>
										</svg>
										<span>{idx < 9 ? `0${idx + 1}` : `${idx + 1}`}</span>
									</div>
								)}
								{item.state === 'completed' && (
									<div className="progress-bar__step_completed">
										<svg
											width="31"
											height="31"
											viewBox="0 0 31 31"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g filter="url(#filter0_b_757_958)">
												<path
													d="M30.1504 15.7727C30.1504 24.057 23.4347 30.7727 15.1504 30.7727C6.86612 30.7727 0.150391 24.057 0.150391 15.7727C0.150391 7.48843 6.86612 0.772705 15.1504 0.772705C23.4347 0.772705 30.1504 7.48843 30.1504 15.7727Z"
													fill="white"
													fillOpacity="0.2"
												/>
											</g>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M20.9248 13.1989L13.6553 20.4683L9.375 16.1883L10.7892 14.774L13.6553 17.6399L19.5106 11.7847L20.9248 13.1989Z"
												fill="#D6FF7E"
											/>
											<defs>
												<filter
													id="filter0_b_757_958"
													x="-3.84961"
													y="-3.22729"
													width="38"
													height="38"
													filterUnits="userSpaceOnUse"
													colorInterpolationFilters="sRGB"
												>
													<feFlood
														floodOpacity="0"
														result="BackgroundImageFix"
													/>
													<feGaussianBlur
														in="BackgroundImage"
														stdDeviation="2"
													/>
													<feComposite
														in2="SourceAlpha"
														operator="in"
														result="effect1_backgroundBlur_757_958"
													/>
													<feBlend
														mode="normal"
														in="SourceGraphic"
														in2="effect1_backgroundBlur_757_958"
														result="shape"
													/>
												</filter>
											</defs>
										</svg>
										<span>{idx < 9 ? `0${idx + 1}` : `${idx + 1}`}</span>
									</div>
								)}
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
};

import React from 'react';
import Button from './Button';
import { Timer } from './Timer';

type StatusBlockProps = {
	coupled: boolean;
	status: string;
	session: any;
	handle_claim: (event: any) => void;
	loginWallet: (event: any) => void;
};

export const StatusBlock = React.memo(({ coupled, status, session, handle_claim, loginWallet }: StatusBlockProps) => {
	const handleClick = (event) => {
    event.preventDefault();
		if (!session.current) {
			/* alert('authenticate and try again')*/;
			loginWallet(event);
		} else {
			handle_claim(event);
		}
	}
	return (
		<div className={`product-block status ${status === 'released' ? 'status_released' : 'status_pending'}`}>
			<h4 className="title product-block__title">Status:</h4>
			<div className="status-info">
				{status === 'released'
				?
				<div className="status-info__top">
					<svg
						width="28"
						height="39"
						viewBox="0 0 28 39"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="24"
							y="33.9455"
							width="20.6341"
							height="33.3382"
							rx="2"
							transform="rotate(-180 24 33.9455)"
							fill="#F3F3F3"
							fillOpacity="0.2"
						/>
						<circle
							cx="13.683"
							cy="24.5459"
							r="5.58072"
							transform="rotate(-180 13.683 24.5459)"
							fill="#4FFF8B"
						/>
						<g filter="url(#filter0_f_374_13)">
							<circle
								cx="13.683"
								cy="24.5459"
								r="5.58072"
								transform="rotate(-180 13.683 24.5459)"
								fill="#4FFF8B"
							/>
						</g>
						<circle
							cx="13.683"
							cy="10.0069"
							r="5.08072"
							transform="rotate(-180 13.683 10.0069)"
							stroke="white"
							strokeOpacity="0.4"
						/>
						<defs>
							<filter
								id="filter0_f_374_13"
								x="0.101562"
								y="10.9652"
								width="27.1621"
								height="27.1614"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="BackgroundImageFix"
									result="shape"
								/>
								<feGaussianBlur
									stdDeviation="4"
									result="effect1_foregroundBlur_374_13"
								/>
							</filter>
						</defs>
					</svg>
					<p>Released to blockchain</p>
				</div>
				:
				<div className="status-info__top">
					<svg
						width="28"
						height="38"
						viewBox="0 0 28 38"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="3.86523"
							y="4.60733"
							width="20.6341"
							height="33.3382"
							rx="2"
							fill="#F3F3F3"
							fillOpacity="0.2"
						/>
						<circle cx="14.1823" cy="14.0069" r="5.58072" fill="#FFC34F" />
						<g filter="url(#filter0_f_374_14)">
							<circle cx="14.1823" cy="14.0069" r="5.58072" fill="#FFC34F" />
						</g>
						<circle
							cx="14.1823"
							cy="28.546"
							r="5.08072"
							stroke="white"
							strokeOpacity="0.4"
						/>
						<defs>
							<filter
								id="filter0_f_374_14"
								x="0.601562"
								y="0.426178"
								width="27.1621"
								height="27.1614"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="BackgroundImageFix"
									result="shape"
								/>
								<feGaussianBlur
									stdDeviation="4"
									result="effect1_foregroundBlur_374_14"
								/>
							</filter>
						</defs>
					</svg>
					<p>Pending</p>
				</div>
				}
				{coupled
				?
				<div className="status-info__bottom">
					<svg
						width="28"
						height="39"
						viewBox="0 0 28 39"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="24"
							y="33.9455"
							width="20.6341"
							height="33.3382"
							rx="2"
							transform="rotate(-180 24 33.9455)"
							fill="#F3F3F3"
							fillOpacity="0.2"
						/>
						<circle
							cx="13.683"
							cy="24.5459"
							r="5.58072"
							transform="rotate(-180 13.683 24.5459)"
							fill="#4FFF8B"
						/>
						<g filter="url(#filter0_f_374_13)">
							<circle
								cx="13.683"
								cy="24.5459"
								r="5.58072"
								transform="rotate(-180 13.683 24.5459)"
								fill="#4FFF8B"
							/>
						</g>
						<circle
							cx="13.683"
							cy="10.0069"
							r="5.08072"
							transform="rotate(-180 13.683 10.0069)"
							stroke="white"
							strokeOpacity="0.4"
						/>
						<defs>
							<filter
								id="filter0_f_374_13"
								x="0.101562"
								y="10.9652"
								width="27.1621"
								height="27.1614"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="BackgroundImageFix"
									result="shape"
								/>
								<feGaussianBlur
									stdDeviation="4"
									result="effect1_foregroundBlur_374_13"
								/>
							</filter>
						</defs>
					</svg>
					<p>United with the original NFT</p>
				</div>
				:
				<div className="status-info__bottom">
					<svg
						width="28"
						height="38"
						viewBox="0 0 28 38"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="3.86523"
							y="4.60733"
							width="20.6341"
							height="33.3382"
							rx="2"
							fill="#F3F3F3"
							fillOpacity="0.2"
						/>
						<circle cx="14.1823" cy="14.0069" r="5.58072" fill="#FFC34F" />
						<g filter="url(#filter0_f_374_14)">
							<circle cx="14.1823" cy="14.0069" r="5.58072" fill="#FFC34F" />
						</g>
						<circle
							cx="14.1823"
							cy="28.546"
							r="5.08072"
							stroke="white"
							strokeOpacity="0.4"
						/>
						<defs>
							<filter
								id="filter0_f_374_14"
								x="0.601562"
								y="0.426178"
								width="27.1621"
								height="27.1614"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="BackgroundImageFix"
									result="shape"
								/>
								<feGaussianBlur
									stdDeviation="4"
									result="effect1_foregroundBlur_374_14"
								/>
							</filter>
						</defs>
					</svg>
					<p>
						Separated
						<span>from Original NFT</span>
					</p>
				</div>
				}
			</div>
			<div className="status-info__btn-wrapper">
				{!coupled
				?
				<button
					className="btn btn_border_green btn-arrow status-info__btn"
					type="button"
					onClick={handleClick}
				>{status === 'released' ? 'Claim ownership' : 'Release to blockchain'}</button>
				:
				<button
					className="btn btn_border_green status-info__btn btn_disable"
					type="button"
					onClick={(e) => e.preventDefault()}
				>Claim ownership</button>
				}
			</div>
			{(status === 'released' && !coupled) ? <Timer /> : ''}
		</div>
	);
});

import React from 'react';
import Button from './Button';
import { Timer } from './Timer';

export const StatusPending: React.FC = () => {
	return (
		<div className="product-block status status_pending">
			<h4 className="title product-block__title">Status:</h4>
			<div className="status-info">
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
			</div>
			<div className="status-info__btn-wrapper">
				<Button
					className="btn btn_border_green btn-arrow status-info__btn"
					type="button"
					properties={{ text: 'Release to blockchain' }}
				></Button>
			</div>
			{/* TODO: Add API integration to timer */}
			<Timer />
		</div>
	);
};

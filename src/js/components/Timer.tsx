import React, { useState } from 'react';

export const Timer: React.FC = () => {
	const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

	return (
		<div className="timer">
			<div className="timer-wrapper">
				<div className="timer-screen">
					<div className="timer-screen__col">
						<span className="timer-screen__count">5</span>
						<span className="timer-screen__text">Days</span>
					</div>
					<div className="timer-screen__col">
						<span className="timer-screen__count">12</span>
						<span className="timer-screen__text">Hours</span>
					</div>
					<div className="timer-screen__col">
						<span className="timer-screen__count">56</span>
						<span className="timer-screen__text">Minutes</span>
					</div>
					<div className="timer-screen__col">
						<span className="timer-screen__count">08</span>
						<span className="timer-screen__text">Seconds</span>
					</div>
				</div>
				<p>till this IMMA NFT will be transferred to&nbsp;IMMA.love trust-wallet</p>
			</div>
			<button
				className="timer__info"
				onMouseOver={() => setIsModalOpened(true)}
				onMouseLeave={() => setIsModalOpened(false)}
			>
				<svg
					width="8"
					height="13"
					viewBox="0 0 8 13"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.77492 6.16355C5.25492 6.16355 5.64959 5.98755 5.95892 5.63555C6.27892 5.28355 6.43892 4.81955 6.43892 4.24355V4.14755C6.43892 3.82755 6.38026 3.52888 6.26292 3.25155C6.15626 2.97422 6.00159 2.73422 5.79892 2.53155C5.59626 2.31822 5.35092 2.15288 5.06292 2.03555C4.77492 1.90755 4.45492 1.84355 4.10292 1.84355C3.33492 1.84355 2.73226 2.07822 2.29492 2.54755C1.85759 3.01688 1.63892 3.63555 1.63892 4.40355V5.07555H0.294922V4.30755C0.294922 3.81688 0.374922 3.34755 0.534922 2.89955C0.705589 2.45155 0.950922 2.05688 1.27092 1.71555C1.59092 1.37422 1.99092 1.10222 2.47092 0.89955C2.95092 0.696884 3.50559 0.595551 4.13492 0.595551C4.66826 0.595551 5.15892 0.686217 5.60692 0.867551C6.05492 1.04888 6.43892 1.29955 6.75892 1.61955C7.07892 1.92888 7.32959 2.29155 7.51092 2.70755C7.69226 3.11288 7.78292 3.54488 7.78292 4.00355V4.29155C7.78292 4.70755 7.70826 5.10755 7.55892 5.49155C7.42026 5.86488 7.22292 6.19022 6.96692 6.46755C6.71092 6.74488 6.40692 6.96888 6.05492 7.13955C5.71359 7.29955 5.34026 7.37955 4.93492 7.37955H4.71092C4.41226 7.37955 4.26292 7.53955 4.26292 7.85955V9.04355H2.98292V7.53955C2.98292 7.13422 3.11092 6.80355 3.36692 6.54755C3.62292 6.29155 3.95359 6.16355 4.35892 6.16355H4.77492ZM2.51892 11.1236C2.51892 10.8142 2.62559 10.5529 2.83892 10.3396C3.06292 10.1156 3.32959 10.0036 3.63892 10.0036C3.94826 10.0036 4.20959 10.1156 4.42292 10.3396C4.64692 10.5529 4.75892 10.8142 4.75892 11.1236C4.75892 11.4329 4.64692 11.6996 4.42292 11.9236C4.20959 12.1369 3.94826 12.2436 3.63892 12.2436C3.32959 12.2436 3.06292 12.1369 2.83892 11.9236C2.62559 11.6996 2.51892 11.4329 2.51892 11.1236Z"
						fill="white"
					/>
				</svg>
				<div
					className="timer-modal"
					style={isModalOpened ? { display: 'block' } : { display: 'none' }}
				>
					<div className="timer-modal__wrapper">
						<ul className="timer-modal__list">
							<li className="timer-modal__item">
								Every new transaction of the original NFT is restarting the 7 days
								window for the current owner of the original NFT to purchase IMMA
								NFT from its current owner.
							</li>
							<li className="timer-modal__item">
								Once the 7 days window is over, IMMA NFT will automatically be moved
								to the imma.love trust-wallet.
							</li>
						</ul>
					</div>
				</div>
			</button>
		</div>
	);
};

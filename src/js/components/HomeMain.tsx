import React, { useState, useEffect } from 'react';
import Button from './Button';
import { NftVideoItem, NftVideo } from './NftVideoItem';
import { mainNftVideoData } from './AllNft';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';

export const HomeMain: React.FC = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		const config = {
			method: 'get',
			url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getLiveFeed`
			// headers: {
			// Origin: 'imma_postman'
			// }
		};

		axios(config)
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<section className="home-main">
			<div className="home-main__wrapper">
				<div className="container">
					<div className="home-main__content">
						<div className="home-main__text">
							<h1 className="title title_size-l home-main__title">
								Add sentimental value to any NFT
							</h1>
							<div className="note home-main__note">
								<p>
									With IMMA anyone can sign on any NFT in order to&nbsp;increase
									it's sentimental value.
								</p>
							</div>
							<div className="home-main__btns">
								<Button
									className="btn btn_border_green home-main__btn"
									type="link"
									properties={{ text: 'Create', href: '#creation' }}
								/>
								<Button
									className="btn home-main__btn"
									type="route"
									properties={{ text: 'To all Imma NFTs', to: '/allnft' }}
								/>
							</div>
						</div>
						<div className="home-main__video">
							<svg
								data-svg="top"
								width="146"
								height="185"
								viewBox="0 0 146 185"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M38.4114 1C23.2817 33.7533 10.7424 67.2945 2.20177 102.406C-1.57354 117.927 5.22682 115.473 20.0177 111.747C43.7401 105.772 66.8775 93.1608 81.7473 73.2266C89.9135 62.2792 91.4423 48.6694 94.8444 35.8614C95.9743 31.6077 95.4004 30.2723 90.3182 30.95C66.6383 34.1073 59.2247 62.2471 51.3158 80.7382C44.2247 97.3174 32.644 115.522 30.1294 133.704C28.1269 148.184 48.0601 137.569 53.8197 134.667C76.1065 123.44 100.476 107.232 115.742 87.0941C122.571 78.0855 118.401 74.9527 108.519 80.064C84.5768 92.4481 63.509 118.949 54.3975 144.105C46.8093 165.055 64.2652 170.414 80.9769 163.558C88.3349 160.539 105.002 153.522 109.193 145.838C109.827 144.677 106.457 144.924 105.245 145.453C97.7442 148.725 91.2437 153.881 86.2735 160.38C64.9007 188.329 130.114 183.011 144.151 183.011"
									stroke="#D6FF7E"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
							<svg
								data-svg="star"
								width="61"
								height="63"
								viewBox="0 0 61 63"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.5406 55.2566C20.9916 41.5397 25.4429 23.9649 34.1032 9.13399C35.383 6.94241 37.0815 3.44882 39.0539 1.614C39.8534 0.870297 39.3154 6.5949 39.3046 6.68999C38.3217 15.3043 36.5189 23.7391 35.9519 32.4146C35.4196 40.5586 35.2201 49.0438 33.4139 57.0426C32.6827 60.2806 33.6955 64.3836 30.4059 58.9852C28.9995 56.6774 27.415 54.5392 25.8939 52.3113C23.2118 48.383 21.5452 43.9513 19.1886 39.8406C15.6737 33.7094 10.7242 28.4735 5.58994 23.6726C3.46539 21.686 1.48865 19.1112 1.01528 16.1526C0.4539 12.644 15.5364 17.1099 16.7446 17.3433C30.8082 20.0606 44.9752 21.6788 58.6999 25.866C61.4838 26.7153 58.0167 28.2465 56.7885 28.9993C51.6976 32.1195 45.7349 33.9434 40.3699 36.5819C33.9755 39.7267 27.7784 43.1428 21.2566 46.1073C16.1436 48.4313 9.98533 50.174 5.46461 53.5646"
									stroke="#D6FF7E"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
							{data && <NftVideoItem properties={data.results[0]} />}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

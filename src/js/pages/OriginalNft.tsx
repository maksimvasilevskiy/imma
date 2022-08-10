import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OriginalNftInfo } from '../components/OriginalNftInfo';
import nftPicture from '../../assets/images/nft-picture.png';
import nftPicture2x from '../../assets/images/nft-picture@2x.png';
import etherumIcon from '../../assets/images/etherum.svg';
import usdIcon from '../../assets/images/usd.svg';
import axios from 'axios';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import { Result } from '../helpers/getLiveFeedTypes';

export const OriginalNft = () => {
	const path = useParams();
	const [inft, setInft] = useState<null | Result>(null);

	const [data, setData] = useState<any | null>(null);

	useEffect(() => {
		if (data && path) {
			const inft: Result = data.results.find((item: Result) => item.uid === path.nft);
			setInft(inft);
		}
	}, [data]);

	useEffect(() => {
		const config = {
			method: 'get',
			url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getLiveFeed`
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
		<main className="main original">
			<div className="bg-lights"></div>
			<section className="original-page">
				<div className="original-page__wrapper">
					<div className="container">
						<div className="product-page__content">
							{(inft) ? (
							<>
							<div className="original-page__nft">
								<h2 className="title title_size-m original-page__title">
									NFT: <span>{inft.nfta.metadata.name}</span>
								</h2>
								<img
									width="370"
									src={inft.nfta.metadata.image}
									alt=""
								/>
								<div className="last-price">
									<div className="last-price__label">
										Price:
									</div>
									<div className="last-price__values">
										<div className="last-price__etherum-value">
											<img alt="icon" src={etherumIcon} />
											<p>{inft.nfta.price_history[0].priceEth}</p>
										</div>
										<div className="last-price__usd-value">
											<img alt="icon" src={usdIcon} />
											<p>{inft.nfta.price_history[0].priceUSD}</p>
										</div>
									</div>
								</div>
							</div>
							<OriginalNftInfo inft={inft} />
							</>
							) : ''}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

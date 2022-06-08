import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NftVideoItem } from '../components/NftVideoItem';
import { tableData, ITableData } from '../helpers/nftTableData';
import { ProductInfo } from '../components/ProductInfo';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';
import { Result, Response } from '../helpers/getLiveFeedTypes';

export const Product: React.FC = () => {
	const path = useParams();

	const [data, setData] = useState<Response | null>(null);

	const [video, setVideo] = useState<null | Result>(null);
	// TODO: Set status by API
	const [status, setStatus] = useState<'released' | 'pending'>('released');

	useEffect(() => {
		if (data && path) {
			const video: Result = data.results.find((item: Result) => item.uid === path.nft);

			setVideo(video);
		}
	}, [data]);

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

	console.log(video);

	if (!video) {
		return (
			<main className="main product">
				<div className="bg-lights"></div>
				<section className="product-page">
					<div className="product-page__wrapper">
						<div className="container">
							<div className="product-page__info">
								<h2 className="title title_size-m product-page__title">
									Loading...
								</h2>
							</div>
						</div>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="main product">
			<div className="bg-lights"></div>
			<section className="product-page">
				<div className="product-page__wrapper">
					<div className="container">
						<div className="product-page__content">
							<div className="product-page__video">
								<h2 className="title title_size-m product-page__title_video">
									IMMA NFT <span>#{video.uid.slice(0, 5)}...</span>
								</h2>
								<NftVideoItem properties={video} videoHeight={658} />
							</div>
							<ProductInfo status={status} video={video} />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

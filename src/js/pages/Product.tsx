import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NftVideoItem } from '../components/NftVideoItem';
import { tableData, ITableData } from '../helpers/nftTableData';
import { ProductInfo } from '../components/ProductInfo';

export const Product: React.FC = () => {
	const path = useLocation();

	const [location, setLocation] = useState<null | string>(null);
	const [video, setVideo] = useState<null | ITableData>(null);
	// TODO: Set status by API
	const [status, setStatus] = useState<'released' | 'pending'>('released');

	useEffect(() => {
		if (path) {
			const pathName: string = path.pathname;

			const reversedPath: string[] = pathName.split('/').reverse();

			const location: string = reversedPath[0] === '' ? reversedPath[1] : reversedPath[0];

			console.log(location);

			setLocation(location);
		}
	}, [path]);

	useEffect(() => {
		const video: ITableData = tableData.find((item: ITableData) => item.slug === location);

		setVideo(video);
	}, [tableData, location]);

	if (!video) {
		return (
			<main className="main product">
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
			<section className="product-page">
				<div className="product-page__wrapper">
					<div className="container">
						<div className="product-page__content">
							<div className="product-page__video">
								<h2 className="title title_size-m product-page__title_video">
									IMMA NFT <span>{video.hash}</span>
								</h2>
								<NftVideoItem properties={video} />
							</div>
							<ProductInfo status={status} video={video} />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

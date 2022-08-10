import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ITableData } from '../helpers/nftTableData';
import { NftVideoItem } from './NftVideoItem';
import { tableData } from '../helpers/nftTableData';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { Result } from '../helpers/getLiveFeedTypes';

import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';

export const ProductMoreNft = ({ video }: { video: null | any }) => {
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
	if (data) {
		if (data.results) {
			return (
				<div className="product-block product-page__swiper">
					<h4 className="title product-block__title">More IMMA NFTs From This Creator</h4>
					<div className="more-swiper">
						<Swiper
							modules={[Navigation]}
							className="more-swiper__swiper"
							onSwiper={(swiper) => console.log(swiper)}
							spaceBetween={28}
							slidesPerView={2}
							navigation={{
								prevEl: '.more-swiper__navigation .left-btn',
								nextEl: '.more-swiper__navigation .right-btn'
							}}
							breakpoints={{
								767: {
									slidesPerView: 2,
									centeredSlides: false
								},
								576: {
									slidesPerView: 1.5
								},
								200: {
									slidesPerView: 1,
									centeredSlides: true
								}
							}}
						>
							{data.results.filter((elem) => {
								console.log(elem.inft.metadata.name === video.inft.metadata.name);
								return elem.inft.metadata.name === video.inft.metadata.name;
							}).map((video) => {
								return (
									<SwiperSlide
										className="all-nft__swiper-slide"
										slide-id={video.uid}
										key={`more-nft-${video.uid}`}
									>
										<NftVideoItem properties={video} />
									</SwiperSlide>
								);
							})}
						</Swiper>
						<div className="more-swiper__navigation">
							<button type="button" className="slide-btn left-btn">
								<svg
									width="26"
									height="10"
									viewBox="0 0 26 10"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M26 5.04736H1M1 5.04736L5.7619 0.547363M1 5.04736L5.7619 9.54736"
										stroke="white"
									/>
								</svg>
							</button>
							<button type="button" className="slide-btn right-btn">
								<svg
									width="26"
									height="10"
									viewBox="0 0 26 10"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0 5.04736H25M25 5.04736L20.2381 0.547363M25 5.04736L20.2381 9.54736"
										stroke="white"
									/>
								</svg>
							</button>
						</div>
						<div className="more-swiper__view-wrapper">
							<Link to="/allnft" className="btn btn-arrow more-swiper__view">
								View all
							</Link>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	} else {
		return null;
	}
};

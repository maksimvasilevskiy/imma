import React, { useState, useEffect } from 'react';
import { NftVideoItem, NftVideo } from './NftVideoItem';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';

import nftPicture from '../../assets/images/nft-picture.png';
import nftPicture2x from '../../assets/images/nft-picture@2x.png';
import nft1 from '../../assets/images/nft1.jpg';
import nft1_2x from '../../assets/images/nft1@2x.jpg';
import nft2 from '../../assets/images/nft2.jpg';
import nft2_2x from '../../assets/images/nft2@2x.jpg';
import nft3 from '../../assets/images/nft3.jpg';
import nft3_2x from '../../assets/images/nft3@2x.jpg';
import nft4 from '../../assets/images/nft4.jpg';
import nft4_2x from '../../assets/images/nft4@2x.jpg';
import nft5 from '../../assets/images/nft5.jpg';
import nft5_2x from '../../assets/images/nft5@2x.jpg';
import sign from '../../assets/images/sign.svg';

export const mainNftVideoData: Array<NftVideo> = [
	{
		id: '1',
		image: {
			quality1x: nft1,
			quality2x: nft1_2x
		},
		slug: 'adam-smith-1',
		sign: sign,
		tag: '@AdamSmith',
		date: new Date('05-09-2021'),
		picture: {
			quality1x: nftPicture,
			quality2x: nftPicture2x
		}
	},
	{
		id: '2',
		image: {
			quality1x: nft2,
			quality2x: nft2_2x
		},
		slug: 'adam-smith-2',
		sign: sign,
		tag: '@AdamSmith',
		date: new Date('05-09-2021'),
		picture: {
			quality1x: nftPicture,
			quality2x: nftPicture2x
		}
	},
	{
		id: '3',
		image: {
			quality1x: nft3,
			quality2x: nft3_2x
		},
		slug: 'adam-smith-3',
		sign: sign,
		tag: '@AdamSmith',
		date: new Date('05-09-2021'),
		picture: {
			quality1x: nftPicture,
			quality2x: nftPicture2x
		}
	},
	{
		id: '4',
		image: {
			quality1x: nft4,
			quality2x: nft4_2x
		},
		slug: 'adam-smith-4',
		sign: sign,
		tag: '@AdamSmith',
		date: new Date('05-09-2021'),
		picture: {
			quality1x: nftPicture,
			quality2x: nftPicture2x
		}
	},
	{
		id: '5',
		image: {
			quality1x: nft5,
			quality2x: nft5_2x
		},
		slug: 'adam-smith-5',
		sign: sign,
		tag: '@AdamSmith',
		date: new Date('05-09-2021'),
		picture: {
			quality1x: nftPicture,
			quality2x: nftPicture2x
		}
	}
];

export const AllNft: React.FC = () => {
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
				<section className="section all-nft">
					<div className="section-wrapper all-nft-wrapper">
						<div className="container">
							<h2 className="title title_size-m all-nft__title">All Imma NFT</h2>
						</div>
						<div className="all-nft__swiper-wrapper">
							<div className="slide-btns__wrapper">
								<div className="slide-btns">
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
							</div>
							<Swiper
								modules={[Navigation]}
								className="all-nft__swiper"
								onSwiper={(swiper) => console.log(swiper)}
								spaceBetween={30}
								slidesPerView={'auto'}
								centeredSlides={false}
								loop={true}
								// onSlideChange={(swiper) => slideChange(swiper)}
								// onTransitionEnd={(swiper) => slideChange(swiper)}
								onSlideChangeTransitionStart={(swiper) =>
									setTimeout((): void => swiper.update(), 110)
								}
								navigation={{
									prevEl: '.all-nft__swiper-wrapper .left-btn',
									nextEl: '.all-nft__swiper-wrapper .right-btn'
								}}
								breakpoints={{
									767: {
										slidesPerView: 'auto',
										centeredSlides: false
									},
									320: {
										slidesPerView: 1,
										centeredSlides: true
									}
								}}
							>
								{data.results.map((video) => {
									return (
										<SwiperSlide
											className="all-nft__swiper-slide"
											slide-id={video.index}
											key={video.index}
										>
											<NftVideoItem properties={video} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</div>
					</div>
				</section>
			);
		} else {
			return null;
		}
	} else {
		return null;
	}
};

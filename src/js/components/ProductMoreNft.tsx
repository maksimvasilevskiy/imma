import React from 'react';
import { Link } from 'react-router-dom';
import { ITableData } from '../helpers/nftTableData';
import { NftVideoItem } from './NftVideoItem';
import { tableData } from '../helpers/nftTableData';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

export const ProductMoreNft = ({ video }: { video: ITableData }) => {
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
					{tableData.map((video) => {
						return (
							<SwiperSlide
								className="all-nft__swiper-slide"
								slide-id={video.id}
								key={video.id}
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
};

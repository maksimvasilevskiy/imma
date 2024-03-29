import React from 'react';
import { Link } from 'react-router-dom';
import { ITableData } from '../helpers/nftTableData';
import { Result } from '../helpers/getLiveFeedTypes';

export const ProductOriginalNft = ({ video }: { video: Result }) => {
	return (
		<div className="product-block product-page__original">
			<h4 className="title product-block__title">Original NFT:</h4>
			<div className="product-page__original-content">
				<img
					width="180"
					height="180"
					className="product-page__original-img"
					src={video.nfta.metadata.image}
					alt=""
				></img>
				<div className="video-play__link">
					<Link to={`/original-nft/${video.uid}`}>
						<svg
							width="27"
							height="10"
							viewBox="0 0 27 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0.882812 5H25.8828M25.8828 5L21.1209 0.5M25.8828 5L21.1209 9.5"
								stroke="white"
							/>
						</svg>
					</Link>
				</div>
			</div>
		</div>
	);
};

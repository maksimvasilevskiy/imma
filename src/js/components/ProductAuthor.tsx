import React from 'react';
import { ITableData } from '../helpers/nftTableData';
import { Result } from '../helpers/getLiveFeedTypes';

export const ProductAuthor = ({ video }: { video: Result }) => {
	return (
		<div className="product-block product-page__author">
			<h4 className="title product-block__title">Signed by:</h4>
			<a
				href={video.inft.creator.social}
				className="link_hover_green product-page__author-tag"
			>
				@{video.inft.metadata.name}
			</a>
			<div className="product-page__author-sign">
				<img height="55" src={video.inft.metadata.image} alt=""></img>
			</div>
		</div>
	);
};

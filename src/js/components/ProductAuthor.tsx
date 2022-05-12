import React from 'react';
import { ITableData } from '../helpers/nftTableData';

export const ProductAuthor = ({ video }: { video: ITableData }) => {
	return (
		<div className="product-block product-page__author">
			<h4 className="title product-block__title">Signed by:</h4>
			<a href={video.author_url} className="link_hover_green product-page__author-tag">
				{video.tag}
			</a>
			<div className="product-page__author-sign">
				<img height="55" src={video.sign} alt=""></img>
			</div>
		</div>
	);
};

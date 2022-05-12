import React from 'react';
import { NumberedBlockProps, NumberedBlock } from './NumberedBlock';
import { AboutDefine } from './AboutDefine';
import aboutImg from '../../assets/images/about_img.png';
import aboutImg2x from '../../assets/images/about_img@2x.png';

const aboutItems: Array<NumberedBlockProps> = [
	{
		number: '01',
		data: [
			{
				type: 'text_bold',
				paragraphs: ['NFT token address that you want to&nbsp;sign&nbsp;on']
			}
		]
	},
	{
		number: '02',
		data: [
			{
				type: 'text_bold',
				paragraphs: ['Your wallet address for receiving related funds:']
			},
			{
				type: 'list',
				list: {
					items: [
						'Consistently receive a percentage when the created IMMA NFT will sell in the future',
						'Payment for creating the IMMA NFT (optional)'
					]
				}
			}
		]
	},
	{
		number: '03',
		data: [
			{
				type: 'text_bold',
				paragraphs: [
					'3rd party/broker wallet address to consistently receive a percentage when the created IMMA NFT will sell in the future (optional)'
				]
			}
		]
	}
];

export const About: React.FC = () => {
	return (
		<section className="section about">
			<div className="section-wrapper about-wrapper">
				<div className="container">
					<h2 className="title title_size-m about-title">
						About <br />
						the <span className="title_wrapped">project</span>
					</h2>
					<div className="note about-note">
						<p>IMMA NFT creation is simple and includes a few steps...</p>
					</div>
					<h3 className="title title_size-xs about-subtitle">
						Before starting, make sure you have the following:
					</h3>
					<div className="about-content">
						{aboutItems.map((numberedBlock: NumberedBlockProps, i) => {
							return (
								<NumberedBlock
									number={numberedBlock.number}
									data={numberedBlock.data}
									key={i}
								/>
							);
						})}
						<img
							width="185"
							data-img="decorative"
							src={aboutImg}
							srcSet={`${aboutImg} 1x, ${aboutImg2x ? aboutImg2x : ''} 2x`}
							alt=""
						/>
					</div>
					<AboutDefine />
				</div>
			</div>
		</section>
	);
};

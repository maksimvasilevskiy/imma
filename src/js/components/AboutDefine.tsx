import React from 'react';
import unsplash from '../../assets/images/unsplash.jpg';
import unsplash2x from '../../assets/images/unsplash@2x.jpg';

type defineListItemT = {
	id: number;
	text: string;
};

type defineListT = {
	title: string;
	list: {
		items: defineListItemT[];
	};
};

// An array for content of lists of the block
const defineLists: defineListT[] = [
	{
		title: '1. Payment details for IMMA NFT',
		list: {
			items: [
				{
					id: 1,
					text: 'Define the price for the IMMA NFT (In case there is any)'
				}
			]
		}
	},
	{
		title: '2. The actual dedication and signature creation:',
		list: {
			items: [
				{
					id: 1,
					text: 'Hit the SNAP button to start recording a video of your dedication'
				},
				{
					id: 2,
					text: 'E-sign on the signature pad, you can add a few words as dedication as well'
				}
			]
		}
	},
	{
		title: '3. Verification:',
		list: {
			items: [
				{
					id: 1,
					text: 'Insert your own Instagram\\Twitter account'
				},
				{
					id: 2,
					text: 'Go to your account DM and grab the code we will send you, and insert it in the verification slot.'
				}
			]
		}
	}
];

export const AboutDefine: React.FC = () => {
	return (
		<div className="about-define">
			<div className="about-define__wrapper">
				<div className="about-define__img">
					<img
						width="328"
						src={unsplash}
						srcSet={`${unsplash} 1x, ${unsplash2x ? unsplash2x : ''} 2x`}
						alt=""
					/>
				</div>
				<div className="about-define__content">
					<h2 className="title title_size-s about-define__content-title">
						A few more steps…
					</h2>
					{defineLists.map(({ title, list }: defineListT) => {
						return (
							<div className="about-define__list-block" key={title}>
								<h4 className="title title_size-xs about-define__list-title">
									{title}
								</h4>
								<ul className="list about-define__list">
									{list.items.map(({ id, text }: defineListItemT) => (
										<li className="list__item about-define__item" key={id}>
											{text}
										</li>
									))}
								</ul>
							</div>
						);
					})}
					<div className="about-define__bottom">
						<p>
							Done! Swipe right to create the IMMA NFT of the original NFT. Proceed to
							your IMMA NFT page in order to release it to the blockchain.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

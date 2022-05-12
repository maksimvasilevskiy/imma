import React from 'react';
import welcomeBig from '../../assets/images/welcome_big.png';
import welcomeBig2x from '../../assets/images/welcome_big@2x.png';
import welcomeSm from '../../assets/images/welcome_sm.png';
import welcomeSm2x from '../../assets/images/welcome_sm@2x.png';

export const Welcome: React.FC = () => {
	return (
		<section className="section welcome">
			<div className=" section-wrapper welcome-wrapper">
				<div className="container">
					<div className="welcome-content">
						<div className="welcome__title-wrapper">
							<h2 className="title title_size-m title_wrapped welcome__title">
								Welcome
							</h2>
						</div>
						<div className="welcome__img_big">
							<img
								height="570"
								src={welcomeBig}
								srcSet={`${welcomeBig} 1x, ${welcomeBig2x ? welcomeBig2x : ''} 2x`}
								alt=""
							></img>
						</div>
						<div className="welcome__text">
							<p>We are pleased to welcome you to the official IMMA NFT web-app.</p>
							<p>
								Using IMMA.love, you can sign dedication on any NFT and make it more
								sentimental and valuable.
							</p>
							<p>
								Anyone can sign any NFT, from family members to the biggest
								celebrities you can imagine.
							</p>
							<p>You can sign on your own NFTs or someone else’s NFT.</p>
						</div>
						<div className="welcome__img_small">
							<img
								height="232"
								src={welcomeSm}
								srcSet={`${welcomeSm} 1x, ${welcomeSm2x ? welcomeSm2x : ''} 2x`}
								alt=""
							></img>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

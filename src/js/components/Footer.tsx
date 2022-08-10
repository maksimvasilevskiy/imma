import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import { SocialLink, socialLinkT } from './SocialLink';
import instagram from '../../assets/images/icons/instagram.svg';
import twitter from '../../assets/images/icons/twitter.svg';
import facebook from '../../assets/images/icons/facebook.svg';
import discord from '../../assets/images/icons/discord.svg';
import instagram_hvr from '../../assets/images/icons/instagram_hovered.svg';
import twitter_hvr from '../../assets/images/icons/twitter_hovered.svg';
import facebook_hvr from '../../assets/images/icons/facebook_hovered.svg';
import discord_hvr from '../../assets/images/icons/discord_hovered.svg';

const footerSocialIcons: Array<socialLinkT> = [
	{
		id: '1',
		name: 'instagram',
		icon: {
			url: instagram,
			url_hovered: instagram_hvr
		},
		link: 'https://instagram.com/imma.love.nft?igshid=YmMyMTA2M2Y='
	},
	{
		id: '2',
		name: 'twitter',
		icon: {
			url: twitter,
			url_hovered: twitter_hvr
		},
		link: 'https://twitter.com/ImmaloveNFT'
	},
	{
		id: '3',
		name: 'facebook',
		icon: {
			url: facebook,
			url_hovered: facebook_hvr
		},
		link: 'https://www.facebook.com/ImmaNFT'
	},
	{
		id: '4',
		name: 'discord',
		icon: {
			url: discord,
			url_hovered: discord_hvr
		},
		link: 'https://discord.gg/fRgeZc9R'
	}
];

export const Footer: React.FC = () => {
	const path = useLocation();

	console.log(path);

	return (
		<footer className="footer">
			<div className="footer-wrapper">
				<div className="container">
					<div className="footer-content">
						<a className="footer-content__logo" href="/#header">
							<img width="117" src={logo} alt="logo"></img>
						</a>
						<div className="footer-content__up-wrapper">
							<a onClick={(e) => {e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });}} href="#header" className="footer-content__up">
								<svg
									width="19"
									height="33"
									viewBox="0 0 19 33"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9.5 32.4531L9.5 2.05273M9.5 2.05273L0.999999 11.0051M9.5 2.05273L18 11.0051"
										stroke="#FFFFFF"
										strokeWidth="2"
									/>
								</svg>
							</a>
						</div>
						<div className="footer-socials__wrapper">
							<div className="footer-socials">
								{footerSocialIcons.map((social: socialLinkT) => {
									return <SocialLink properties={social} key={social.id} />;
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

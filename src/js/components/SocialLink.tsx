import React, { useState } from 'react';

export type socialLinkT = {
	id: string;
	name: string; // For adding different sizes to the icons using their name
	icon: {
		url: string;
		url_hovered: string;
	};
	link: string;
};

export const SocialLink = ({ properties }: { properties: socialLinkT }) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);

	return (
		<a
			href={properties.link}
			className="footer-socials__icon"
			onMouseOver={() => setIsHovered(true)}
			onMouseOut={() => setIsHovered(false)}
		>
			<img
				data-social={properties.name}
				src={isHovered ? properties.icon.url_hovered : properties.icon.url}
				alt="social icon"
			></img>
		</a>
	);
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface NftVideo {
	id: string;
	image: {
		quality1x: string;
		quality2x: string;
	};
	slug: string;
	sign: string;
	tag: string;
	date: Date;
	picture: {
		quality1x: string;
		quality2x: string;
	};
}

// Array for converting number of month to string
export const monthConvertArr: Array<string> = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const NftVideoItem = ({ properties }: { properties: NftVideo }) => {
	const [convertedDate, setConvertedDate] = useState<null | string>(null);

	useEffect(() => {
		const date: Date = properties.date;

		let day: string = String(date.getDate());
		day = day.length === 1 ? `0${day}` : day;

		const month: string = monthConvertArr[date.getMonth()];
		const year: number = date.getFullYear();

		const fullDate = `${month} ${day}, ${year}`;

		setConvertedDate(fullDate);
	}, [properties]);

	return (
		<div className="video">
			<img
				width="370"
				className="video-preview"
				src={properties.image.quality1x}
				srcSet={`${properties.image.quality1x} 1x, ${
					properties.image.quality2x ? properties.image.quality2x : ''
				} 2x`}
				alt=""
			></img>
			<div className="video-play__wrapper">
				<Link to={`allnft/${properties.slug}`} className="video-play">
					<svg
						data-svg="play"
						width="21"
						height="26"
						viewBox="0 0 21 26"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.200195 12.9473V2.55576C0.200195 0.98489 1.9281 0.0272036 3.26019 0.859764L19.8866 11.2513C21.1399 12.0346 21.1399 13.8599 19.8866 14.6433L3.26019 25.0348C1.9281 25.8673 0.200195 24.9096 0.200195 23.3388V12.9473Z"
							fill="#D6FF7E"
						/>
					</svg>
				</Link>
			</div>
			<div className="video-icon">
				<img width="44" height="44" src={properties.picture.quality1x} alt="" />
			</div>
			<div className="video-bottom">
				<div className="video-bottom__sign">
					<img src={properties.sign} alt="sign"></img>
				</div>
				<div className="video-bottom__tag">
					<p>{properties.tag}</p>
					<time className="video-bottom__tag-date">{convertedDate}</time>
				</div>
			</div>
		</div>
	);
};

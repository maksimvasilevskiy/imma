import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mainVideo from '../../assets/video/main-video.MP4';
import poster from '../../assets/images/poster.jpg';

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

export const NftMainVideoItem = () => {
	const [convertedDate, setConvertedDate] = useState<null | string>(null);
	const vidRef = useRef(null);
  const [show, setShow] = useState(true);

	const handlePlayVideo = () => {
		if (show) {
			vidRef.current.play();
		} else {
			vidRef.current.pause();
		}
		setShow(prev => !prev);
  }

	return (
		<div
			className="video"
			style={{ height: `658px` }}
		>
			<video
				width="370"
				height="658"
				src={mainVideo}
				className="video-preview"
				ref={vidRef}
				onClick={handlePlayVideo}
				poster={poster}
				loop
			></video>
			{show
				&&
				<div className="video-play__wrapper" onClick={handlePlayVideo}>
					<div className="video-play">
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
					</div>
				</div>
			}
			{/*<div className="video-bottom">
				<div className="video-bottom__sign">
					<img height="60" src={properties.inft.metadata.image} alt="sign"></img>
				</div>
				<div className="video-bottom__tag">
					<p>@{properties.inft.metadata.name}</p>
					<time className="video-bottom__tag-date">{convertedDate}</time>
				</div>
			</div>*/}
		</div>
	);
};

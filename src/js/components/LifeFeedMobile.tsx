import React from 'react';
import avatar from '../../assets/images/icons/avatar.svg';
import { Link } from 'react-router-dom';
import { ITableData } from '../helpers/nftTableData';

interface LifeFeedMobileProps {
	tableData: Array<ITableData>;
	dateConvert: (date: Date) => string;
}

export const LifeFeedMobile = ({ tableData, dateConvert }: LifeFeedMobileProps) => {
	return (
		<div className="lifefeed-mobile">
			{tableData.map((row) => {
				const dateOutput: string = dateConvert(row.date);
				const dateString: string = `02\\04\\22 02:00`;
				const shortToken: string = row.token.slice(0, 13) + '...';

				return (
					<div className="lifefeed-mobile__item" key={row.id}>
						<div className="lifefeed-mobile__video">
							<div className="video">
								<img
									width="100"
									className="video-preview"
									src={row.image.quality1x}
									srcSet={`${row.image.quality1x} 1x, ${
										row.image.quality2x ? row.image.quality2x : ''
									} 2x`}
									alt=""
								></img>
								<div className="video-play__wrapper">
									<Link to={row.slug} className="video-play">
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
							</div>
							<img data-img="sign" src={row.sign} alt="sign" />
						</div>
						<div className="lifefeed-mobile__info">
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">IMMA NFT</h4>
								<p>{row.tag}</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">Signed & Created by</h4>
								<p>{row.author}</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">Original NFT token</h4>
								<p>
									<a href="/">{shortToken}</a>
								</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">Date/Time</h4>
								<p>{dateOutput}</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">TX</h4>
								<a href={row.tx.link}>
									<svg
										width="18"
										height="19"
										viewBox="0 0 18 19"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7 3.76514H1.5V17.7651H15.5V12.7651"
											stroke="white"
											strokeWidth="2"
										/>
										<path
											d="M10 8.76514L17 1.76514M17 1.76514V8.76514M17 1.76514H10"
											stroke="white"
											strokeWidth="2"
										/>
									</svg>
								</a>
							</div>
						</div>
						<div className="lifefeed-mobile__activity">
							<img src={row.avatar ? row.avatar : avatar} alt="avatar" />
							<div className="lifefeed-mobile__activity-block">
								<p>Reunited with Original NFT wallet</p>
								<p className="title">
									by&nbsp;
									<a className="link" href="/">
										0x217828160ff79e02c67A2785fd8dA2D2bD86c28E
									</a>
								</p>
								<p className="title">{dateString}</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

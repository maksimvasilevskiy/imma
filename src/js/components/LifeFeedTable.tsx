import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ITableData, ActivityT } from '../helpers/nftTableData';
import avatar from '../../assets/images/icons/avatar.svg';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';

interface LifeFeedTableProps {
	tableColumnsNames: Array<string>;
	tableData: Array<ITableData>;
	dateConvert: (date: Date) => string;
	convertDateToString: (date: Date) => string;
}

export const LifeFeedTable = ({
	tableColumnsNames,
	tableData,
	dateConvert,
	convertDateToString
}: LifeFeedTableProps) => {
	const [data, setData] = useState<null | any>(null);

	useEffect(() => {
		const config = {
			method: 'get',
			url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getLiveFeed`
			// headers: {
			// Origin: 'imma_postman'
			// }
		};
		console.log('config.url');
		console.log(config.url);

		axios(config)
			.then((response) => {
				setData(response.data);
				console.log('lifefeed data');
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	console.log(data);

	return (
		<table className="table lifefeed-table">
			<thead className="table-header">
				<tr className="table-row">
					{tableColumnsNames.map((columnName, i) => {
						return (
							<td className="table-col" key={i}>
								{columnName}
							</td>
						);
					})}
				</tr>
			</thead>
			<tbody className="table-body">
				{/* TODO: Remove this example */}
				{/* {tableData.map((row) => {
					const dateOutput: string = dateConvert(row.date);
					const shortToken: string = row.token.slice(0, 13) + '...';

					const dateString: string = convertDateToString(row.date);
					const lastActivity: ActivityT | undefined = row.activity[0];

					return (
						<tr className="table-row" key={row.id}>
							<td className="table-col">
								<div className="video">
									<img
										width="370"
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
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">IMMA NFT</p>
									<p>{row.hash}</p>
									<p className="title">Date/Time</p>
									<p>{dateOutput}</p>
								</div>
							</td>
							<td className="table-col">
								<p className="title">Signed & Created by</p>
								<div className="table-author">
									<svg
										width="22"
										height="22"
										viewBox="0 0 22 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g clipPath="url(#clip0_658_2)">
											<path
												d="M21.1881 4.50665C20.4574 4.8304 19.6726 5.04915 18.8474 5.14802C19.6988 4.63859 20.3358 3.83681 20.6394 2.89227C19.8396 3.36739 18.9641 3.70182 18.0512 3.88102C17.4373 3.22553 16.6241 2.79106 15.738 2.64506C14.8518 2.49907 13.9423 2.64972 13.1505 3.07362C12.3588 3.49752 11.7291 4.17097 11.3593 4.98939C10.9895 5.80781 10.9003 6.72543 11.1054 7.59977C9.48466 7.5184 7.89911 7.09713 6.45168 6.36332C5.00426 5.6295 3.7273 4.59954 2.70369 3.34027C2.35369 3.94402 2.15244 4.64402 2.15244 5.38952C2.15205 6.06064 2.31732 6.72149 2.63358 7.31341C2.94985 7.90534 3.40733 8.41006 3.96544 8.78277C3.31818 8.76218 2.6852 8.58728 2.11919 8.27265V8.32515C2.11912 9.26642 2.44472 10.1787 3.04072 10.9073C3.63673 11.6358 4.46644 12.1357 5.38906 12.3221C4.78862 12.4846 4.15911 12.5086 3.54806 12.3921C3.80837 13.2021 4.31543 13.9103 4.99826 14.4177C5.68108 14.9251 6.50549 15.2063 7.35606 15.2219C5.91217 16.3554 4.12896 16.9702 2.29331 16.9675C1.96815 16.9676 1.64325 16.9486 1.32031 16.9106C3.1836 18.1087 5.35261 18.7445 7.56781 18.742C15.0666 18.742 19.1659 12.5313 19.1659 7.14477C19.1659 6.96977 19.1616 6.79302 19.1537 6.61802C19.9511 6.04138 20.6394 5.32731 21.1863 4.50927L21.1881 4.50665Z"
												fill="white"
											/>
										</g>
										<defs>
											<clipPath id="clip0_658_2">
												<rect
													width="21"
													height="21"
													fill="white"
													transform="translate(0.5 0.187012)"
												/>
											</clipPath>
										</defs>
									</svg>
									<p>{row.author}</p>
								</div>
								<p className="title">TX</p>
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
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">Original NFT token</p>
									<p>
										<a className="link" href="/">
											{shortToken}
										</a>
									</p>
									<img src={row.sign} alt="sign" />
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<img
										src={lastActivity.icon ? lastActivity.icon : avatar}
										alt="activity icon"
									/>
									<div>
										<p>{lastActivity.event}</p>
										<p className="title">
											by{' '}
											<a className="link" href="/">
												{lastActivity.from}
											</a>
										</p>
										<p className="title">{lastActivity.epoch}</p>
									</div>
								</div>
							</td>
						</tr>
					);
				})} */}
				{data &&
					data.results.map((row, idx) => {
						// To limit the number of video items
						if (idx > 5) {
							return null;
						}

						const shortToken: string = row.nfta.token_address.slice(0, 13) + '...';

						const dateOutput: string = dateConvert(new Date(row.inft.date.last_update));
						const lastActivity: ActivityT | undefined = row.activity[0];

						const lastActivityDate: string = convertDateToString(
							new Date(lastActivity.epoch)
						);

						const uid: string = `#${row.uid.slice(0, 5)}...`;

						return (
							<tr className="table-row" key={row.index}>
								<td className="table-col">
									<div className="video" style={{ height: '100%' }}>
									<Link to={`/allnft/${row.uid}`}>
										<video
											width="370"
											src={row.inft.metadata.animation_url + '#t=1'}
											preload="metadata"
											className="video-preview"
										></video>
									</Link>
										{/*<div className="video-play__wrapper">
											<Link to={`/allnft/${row.uid}`} className="video-play">
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
										</div>*/}
									</div>
								</td>
								<td className="table-col">
									<div className="table-col__wrapper">
										<p className="title">IMMA NFT</p>
										<p>{uid}</p>
										<p className="title">Date/Time</p>
										<p>{dateOutput}</p>
									</div>
								</td>
								<td className="table-col">
									<p className="title">Signed & Created by</p>
									<a
										href={row.inft.creator.social}
										target="_blank"
										rel="noopener noreferrer"
										className="table-author"
									>
										<svg
											width="22"
											height="22"
											viewBox="0 0 22 22"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clipPath="url(#clip0_658_2)">
												<path
													d="M21.1881 4.50665C20.4574 4.8304 19.6726 5.04915 18.8474 5.14802C19.6988 4.63859 20.3358 3.83681 20.6394 2.89227C19.8396 3.36739 18.9641 3.70182 18.0512 3.88102C17.4373 3.22553 16.6241 2.79106 15.738 2.64506C14.8518 2.49907 13.9423 2.64972 13.1505 3.07362C12.3588 3.49752 11.7291 4.17097 11.3593 4.98939C10.9895 5.80781 10.9003 6.72543 11.1054 7.59977C9.48466 7.5184 7.89911 7.09713 6.45168 6.36332C5.00426 5.6295 3.7273 4.59954 2.70369 3.34027C2.35369 3.94402 2.15244 4.64402 2.15244 5.38952C2.15205 6.06064 2.31732 6.72149 2.63358 7.31341C2.94985 7.90534 3.40733 8.41006 3.96544 8.78277C3.31818 8.76218 2.6852 8.58728 2.11919 8.27265V8.32515C2.11912 9.26642 2.44472 10.1787 3.04072 10.9073C3.63673 11.6358 4.46644 12.1357 5.38906 12.3221C4.78862 12.4846 4.15911 12.5086 3.54806 12.3921C3.80837 13.2021 4.31543 13.9103 4.99826 14.4177C5.68108 14.9251 6.50549 15.2063 7.35606 15.2219C5.91217 16.3554 4.12896 16.9702 2.29331 16.9675C1.96815 16.9676 1.64325 16.9486 1.32031 16.9106C3.1836 18.1087 5.35261 18.7445 7.56781 18.742C15.0666 18.742 19.1659 12.5313 19.1659 7.14477C19.1659 6.96977 19.1616 6.79302 19.1537 6.61802C19.9511 6.04138 20.6394 5.32731 21.1863 4.50927L21.1881 4.50665Z"
													fill="white"
												/>
											</g>
											<defs>
												<clipPath id="clip0_658_2">
													<rect
														width="21"
														height="21"
														fill="white"
														transform="translate(0.5 0.187012)"
													/>
												</clipPath>
											</defs>
										</svg>
										<p>{row.inft.metadata.name}</p>
									</a>
									<p className="title">TX</p>
									<Link to="/">
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
									</Link>
								</td>
								<td className="table-col">
									<div className="table-col__wrapper">
										<p className="title">Original NFT token</p>
										<p>
											<a className="link" href="/">
												{shortToken}
											</a>
										</p>
										{row.inft.metadata.image && (
											<img
												width="100"
												data-img="sign"
												src={row.inft.metadata.image}
												alt="sign"
											/>
										)}
									</div>
								</td>
								<td className="table-col">
									<div className="table-col__wrapper">
										<img
											src={lastActivity.icon ? lastActivity.icon : avatar}
											alt="activity icon"
										/>
										<div>
											<p>{lastActivity.event}</p>
											<p className="title">
												by{' '}
												<a className="link" href="/">
													{lastActivity.by}
												</a>
											</p>
											<p className="title">{lastActivityDate}</p>
										</div>
									</div>
								</td>
							</tr>
						);
					})}
			</tbody>
		</table>
	);
};

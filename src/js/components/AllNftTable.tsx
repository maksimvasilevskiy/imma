import React from 'react';
import { Link } from 'react-router-dom';
import { monthConvertArr } from './NftVideoItem';
import { dateConvert, convertDateToString } from '../helpers/nftTableData';
//import { ITableData } from '../helpers/nftTableData';

function convertDate(date: Date) {
	let day: string = String(date.getDate());
	day = day.length === 1 ? `0${day}` : day;

	const month: string = monthConvertArr[date.getMonth()];
	const year: number = date.getFullYear();

	const fullDate: string = `${month} ${day}, ${year}`;

	return fullDate;
}

interface AllNftTableProps {
	tableData: null | any;
	allTableVisible: boolean;
}

export const AllNftTable = ({ tableData, allTableVisible }: AllNftTableProps) => {
	return (
		<table className="table lifefeed-table">
			<tbody className="table-body">
				{(tableData) ? tableData.map((row, i) => {
					//console.log(row);
					const shortToken: string = row.nfta.token_address.slice(0, 17) + '...';
					//const shortToken: string = row.token.slice(0, 17) + '...';
					const shortOwnerWallet: string = row.inft.owner.wallet.slice(0, 9) + '...';
					//console.log('last update')
					//console.log(row.inft.date.last_update);
					const convertedDate: string = dateConvert(new Date(row.inft.date.last_update));

					const lastPrice: number = row.inft.price_history[0] ? Number(row.inft.price_history[0].priceEth) : 0;

					const maxNftsInTable: number = 8;

					return (
						<tr
							className="table-row"
							key={`all-nft-${i}`}
							/*style={
								i >= maxNftsInTable && !allTableVisible
									? { display: 'none' }
									: { display: 'flex' }
							}*/
						>
							<td className="table-col">
								<div className="video__wrapper">
									<div className="video">
										<Link to={`/allnft/${row.uid}`}>
											<video
												width="370"
												height="123"
												src={row.inft.metadata.animation_url + '#t=1'}
												preload="metadata"
												className="video-preview"
											></video>
										</Link>
										{/*<img
											width="370"
											className="video-preview"
											src={row.image.quality1x}
											srcSet={`${row.image.quality1x} 1x, ${
												row.image.quality2x ? row.image.quality2x : ''
											} 2x`}
											alt=""
										/>*/}
										<div className="video-bottom">
											<div className="video-bottom__sign">
												<img width="40" src={row.inft.metadata.image} alt="sign"></img>
											</div>
											<time className="video-bottom__tag-date">
												{convertedDate}
											</time>
										</div>
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
										<div className="video-play__link">
											<Link to={`/allnft/${row.uid}`}>
												<svg
													width="21"
													height="9"
													viewBox="0 0 21 9"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M0.107422 4.62582H20.1074M20.1074 4.62582L16.2979 1.02582M20.1074 4.62582L16.2979 8.22582"
														stroke="white"
														strokeWidth="0.84374"
													/>
												</svg>
											</Link>
										</div>
									</div>
								</div>
							</td>
							<td className="table-col">
								<p className="title">Signed and created by</p>
								<div className="table-author">
									<svg
										width="15"
										height="16"
										viewBox="0 0 15 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M14.7772 3.66767C14.2553 3.89892 13.6947 4.05517 13.1053 4.1258C13.7134 3.76192 14.1684 3.18922 14.3853 2.51455C13.814 2.85392 13.1887 3.0928 12.5366 3.2208C12.0981 2.75259 11.5172 2.44225 10.8843 2.33797C10.2513 2.23369 9.60162 2.34129 9.03609 2.64408C8.47055 2.94687 8.0208 3.4279 7.75666 4.01249C7.49252 4.59708 7.42877 5.25252 7.57531 5.87705C6.41762 5.81892 5.28508 5.51802 4.2512 4.99386C3.21733 4.46971 2.30521 3.73402 1.57406 2.83455C1.32406 3.2658 1.18031 3.7658 1.18031 4.2983C1.18003 4.77767 1.29808 5.2497 1.52399 5.67251C1.74989 6.09531 2.07666 6.45582 2.47531 6.72205C2.01299 6.70734 1.56086 6.58241 1.15656 6.35767V6.39517C1.15652 7.06751 1.38908 7.71916 1.8148 8.23955C2.24052 8.75993 2.83317 9.11701 3.49219 9.25017C3.0633 9.36625 2.61365 9.38334 2.17719 9.30017C2.36312 9.87868 2.72531 10.3846 3.21304 10.747C3.70077 11.1094 4.28964 11.3103 4.89719 11.3214C3.86583 12.1311 2.59212 12.5702 1.28094 12.5683C1.04868 12.5684 0.81661 12.5548 0.585938 12.5277C1.91686 13.3834 3.46615 13.8376 5.04844 13.8358C10.4047 13.8358 13.3328 9.39955 13.3328 5.55205C13.3328 5.42705 13.3297 5.3008 13.3241 5.1758C13.8936 4.76391 14.3853 4.25386 14.7759 3.66955L14.7772 3.66767Z"
											fill="white"
										/>
									</svg>
									<p>{row.inft.metadata.name}</p>
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">IMMA NFT</p>
									<p>#{row.uid.slice(0, 17) + '...'}</p>
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">Original NFT token address</p>
									<p>
										<a className="link" href="/">
											{shortToken}
										</a>
									</p>
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">Current owner wallet</p>
									<p>
										<a className="link" href={row.owner_wallet_url}>
											{shortOwnerWallet}
										</a>
									</p>
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<img src={row.inft.metadata.image} alt="sign" />
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">Last Price</p>
									<p>{row.activity[0].priceETH} ETH</p>
								</div>
							</td>
						</tr>
					);
				}) : ''}
			</tbody>
		</table>
	);
};

interface AllNftMobileProps {
	tableData: null | any;
	allTableVisible: boolean;
}

export const AllNftMobile = ({ tableData, allTableVisible }: AllNftMobileProps) => {
	return (
		<div className="all-nft_mobile">
			{tableData.map((row, i) => {
				const shortToken: string = row.nfta.token_address.slice(0, 17) + '...';
			//const shortToken: string = row.token.slice(0, 17) + '...';
				const shortOwnerWallet: string = row.inft.owner.wallet.slice(0, 9) + '...';

				const lastPrice: number = row.inft.price_history[0] ? Number(row.inft.price_history[0].priceEth) : 0;

				//console.log('row.inft.price_history[0]');
				//console.log(row.inft.price_history[0]);

				const maxNftsInTable: number = 8;

				return (
					<div
						className="lifefeed-mobile__item"
						key={`all-nft-mob-${i}`}
						/*style={
							i >= maxNftsInTable && !allTableVisible
								? { display: 'none' }
								: { display: 'flex' }
						}*/
					>
						<div className="lifefeed-mobile__video">
							<div className="video">
								<video
									width="138"
									src={row.inft.metadata.animation_url + '#t=1'}
									preload="metadata"
									className="video-preview"
								></video>
								{/*<img
									width="138"
									className="video-preview"
									src={row.image.quality1x}
									srcSet={`${row.image.quality1x} 1x, ${
										row.image.quality2x ? row.image.quality2x : ''
									} 2x`}
									alt=""
								></img>*/}
								<div className="video-play__wrapper">
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
								</div>
								<div className="video-play__link">
									<Link to={`/allnft/${row.uid}`}>
										<svg
											width="21"
											height="9"
											viewBox="0 0 21 9"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M0.107422 4.62582H20.1074M20.1074 4.62582L16.2979 1.02582M20.1074 4.62582L16.2979 8.22582"
												stroke="white"
												strokeWidth="0.84374"
											/>
										</svg>
									</Link>
								</div>
							</div>
							{row.inft.metadata.image && (
								<img data-img="sign" src={row.inft.metadata.image} alt="sign" />
							)}
						</div>
						<div className="lifefeed-mobile__info">
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">Signed and created by</h4>
								<div className="table-author">
									<svg
										width="15"
										height="16"
										viewBox="0 0 15 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M14.7772 3.95451C14.2553 4.18576 13.6947 4.34201 13.1053 4.41263C13.7134 4.04875 14.1684 3.47605 14.3853 2.80138C13.814 3.14075 13.1887 3.37963 12.5366 3.50763C12.0981 3.03942 11.5172 2.72909 10.8843 2.6248C10.2513 2.52052 9.60162 2.62813 9.03609 2.93092C8.47055 3.2337 8.0208 3.71473 7.75666 4.29932C7.49252 4.88391 7.42877 5.53935 7.57531 6.16388C6.41762 6.10576 5.28508 5.80485 4.2512 5.2807C3.21733 4.75655 2.30521 4.02086 1.57406 3.12138C1.32406 3.55263 1.18031 4.05263 1.18031 4.58513C1.18003 5.06451 1.29808 5.53654 1.52399 5.95934C1.74989 6.38215 2.07666 6.74266 2.47531 7.00888C2.01299 6.99417 1.56086 6.86925 1.15656 6.64451V6.68201C1.15652 7.35435 1.38908 8.00599 1.8148 8.52638C2.24052 9.04677 2.83317 9.40384 3.49219 9.53701C3.0633 9.65308 2.61365 9.67018 2.17719 9.58701C2.36312 10.1655 2.72531 10.6714 3.21304 11.0338C3.70077 11.3963 4.28964 11.5971 4.89719 11.6083C3.86583 12.4179 2.59212 12.8571 1.28094 12.8551C1.04868 12.8552 0.81661 12.8416 0.585938 12.8145C1.91686 13.6702 3.46615 14.1244 5.04844 14.1226C10.4047 14.1226 13.3328 9.68638 13.3328 5.83888C13.3328 5.71388 13.3297 5.58763 13.3241 5.46263C13.8936 5.05074 14.3853 4.54069 14.7759 3.95638L14.7772 3.95451Z"
											fill="white"
										/>
									</svg>
									<p>{row.inft.metadata.name}</p>
								</div>
							</div>
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">IMMA NFT</h4>
								<p>#{row.uid.slice(0, 17) + '...'}</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<p className="title">Original NFT token address</p>
								<p>
									<a className="link" href="/">
										{shortToken}
									</a>
								</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<p className="title">Current owner wallet</p>
								<p>
									<a className="link" href={row.owner_wallet_url}>
										{shortOwnerWallet}
									</a>
								</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<div className="table-col__wrapper">
									<p className="title">Last Price</p>
									<p>{lastPrice} ETH</p>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

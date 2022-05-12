import React from 'react';
import { Link } from 'react-router-dom';
import { monthConvertArr } from './NftVideoItem';
import { ITableData } from '../helpers/nftTableData';

function convertDate(date: Date) {
	let day: string = String(date.getDate());
	day = day.length === 1 ? `0${day}` : day;

	const month: string = monthConvertArr[date.getMonth()];
	const year: number = date.getFullYear();

	const fullDate: string = `${month} ${day}, ${year}`;

	return fullDate;
}

interface AllNftTableProps {
	tableData: Array<ITableData>;
	allTableVisible: boolean;
}

export const AllNftTable = ({ tableData, allTableVisible }: AllNftTableProps) => {
	return (
		<table className="table lifefeed-table">
			<tbody className="table-body">
				{tableData.map((row, i) => {
					const shortToken: string = row.token.slice(0, 17) + '...';
					const shortOwnerWallet: string = row.owner_wallet.slice(0, 9) + '...';
					const convertedDate: string = convertDate(row.date);

					const lastPrice: number = Number(row.lastprice);

					const maxNftsInTable: number = 8;

					return (
						<tr
							className="table-row"
							key={row.id}
							style={
								i >= maxNftsInTable && !allTableVisible
									? { display: 'none' }
									: { display: 'flex' }
							}
						>
							<td className="table-col">
								<div className="video__wrapper">
									<div className="video">
										<img
											width="370"
											className="video-preview"
											src={row.image.quality1x}
											srcSet={`${row.image.quality1x} 1x, ${
												row.image.quality2x ? row.image.quality2x : ''
											} 2x`}
											alt=""
										/>
										<div className="video-bottom">
											<div className="video-bottom__sign">
												<img width="40" src={row.sign} alt="sign"></img>
											</div>
											<time className="video-bottom__tag-date">
												{convertedDate}
											</time>
										</div>
										<div className="video-play__wrapper">
											<Link to={`/allnft/${row.slug}`} className="video-play">
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
											<Link to={`/allnft/${row.slug}`}>
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
								<p>{row.author}</p>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">IMMA NFT {row.hash}</p>
									<p>{row.hash}</p>
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
									<img src={row.sign} alt="sign" />
								</div>
							</td>
							<td className="table-col">
								<div className="table-col__wrapper">
									<p className="title">Last Price</p>
									<p>{lastPrice} ETH</p>
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

interface AllNftMobileProps {
	tableData: Array<ITableData>;
	allTableVisible: boolean;
}

export const AllNftMobile = ({ tableData, allTableVisible }: AllNftMobileProps) => {
	return (
		<div className="all-nft_mobile">
			{tableData.map((row, i) => {
				const shortToken: string = row.token.slice(0, 13) + '...';
				const shortOwnerWallet: string = row.owner_wallet.slice(0, 8) + '...';

				const lastPrice: number = Number(row.lastprice);

				const maxNftsInTable: number = 8;

				return (
					<div
						className="lifefeed-mobile__item"
						key={row.id}
						style={
							i >= maxNftsInTable && !allTableVisible
								? { display: 'none' }
								: { display: 'flex' }
						}
					>
						<div className="lifefeed-mobile__video">
							<div className="video">
								<img
									width="138"
									className="video-preview"
									src={row.image.quality1x}
									srcSet={`${row.image.quality1x} 1x, ${
										row.image.quality2x ? row.image.quality2x : ''
									} 2x`}
									alt=""
								></img>
								<div className="video-play__wrapper">
									<Link to={`/allnft/${row.slug}`} className="video-play">
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
									<Link to={`/allnft/${row.slug}`}>
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
							<img data-img="sign" src={row.sign} alt="sign" />
						</div>
						<div className="lifefeed-mobile__info">
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">Signed and created by</h4>
								<p>{row.author}</p>
							</div>
							<div className="lifefeed-mobile__info-block">
								<h4 className="title">IMMA NFT {row.hash}</h4>
								<p>{row.hash}</p>
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

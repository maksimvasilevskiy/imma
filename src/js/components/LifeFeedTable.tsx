import React from 'react';
import { Link } from 'react-router-dom';
import { ITableData, ActivityT } from '../helpers/nftTableData';
import avatar from '../../assets/images/icons/avatar.svg';

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
				{tableData.map((row) => {
					const dateOutput: string = dateConvert(row.date);
					const shortToken: string = row.token.slice(0, 13) + '...';

					const dateString: string = convertDateToString(row.date);
					const lastActivity: ActivityT = row.activity[0];

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
								<p>{row.author}</p>
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
												{lastActivity.wallet}
											</a>
										</p>
										<p className="title">{lastActivity.time}</p>
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

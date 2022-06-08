import React from 'react';
import { ITableData } from '../helpers/nftTableData';
import avatar from '../../assets/images/icons/avatar.svg';
import { Result } from '../helpers/getLiveFeedTypes';
import { convertDateToString } from '../helpers/nftTableData';

export const ProductActivity = React.memo(({ video }: { video: Result }) => {
	return (
		<div className="product-block product-page__activity">
			<h4 className="title product-block__title">Activity:</h4>
			<div className="activity">
				<ul className="activity-list">
					{video.activity.map((activity) => {
						const activityDate: string = convertDateToString(new Date(activity.epoch));

						return (
							// TODO: When adding API delete 'i' from key
							<li className="activity-item" key={activity.epoch}>
								<div className="activity-item__wrapper">
									<img
										width="50"
										height="50"
										className="activity-item__img"
										src={activity.icon ? activity.icon : avatar}
										alt="activity icon"
									/>
									<div className="activity-item__content">
										<p className="activity-item__event">{activity.event}</p>
										{activity.from && (
											<p className="activity-item__wallet">
												by{' '}
												<a className="link link_hover_green" href="/">
													{activity.from}
												</a>
											</p>
										)}
										{activity.priceETH && (
											<p className="activity-item__price">
												{activity.priceETH} ETH
											</p>
										)}
										<p className="activity-item__time">{activityDate}</p>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
});

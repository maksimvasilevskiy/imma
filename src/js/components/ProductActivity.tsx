import React from 'react';
import { ITableData } from '../helpers/nftTableData';
import avatar from '../../assets/images/icons/avatar.svg';

export const ProductActivity = React.memo(({ video }: { video: ITableData }) => {
	return (
		<div className="product-block product-page__activity">
			<h4 className="title product-block__title">Activity:</h4>
			<div className="activity">
				<ul className="activity-list">
					{video.activity.map((activity, i) => {
						return (
							// TODO: When adding API delete 'i' from key
							<li className="activity-item" key={activity.time + i}>
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
										{activity.wallet && (
											<p className="activity-item__wallet">
												by{' '}
												<a className="link link_hover_green" href="/">
													{activity.wallet}
												</a>
											</p>
										)}
										{activity.price && (
											<p className="activity-item__price">{activity.price}</p>
										)}
										<p className="activity-item__time">{activity.time}</p>
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

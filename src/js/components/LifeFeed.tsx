import React from 'react';
import { LifeFeedTable } from './LifeFeedTable';
import { LifeFeedMobile } from './LifeFeedMobile';
import { tableData, dateConvert, convertDateToString } from '../helpers/nftTableData';

const homeTableColumnsNames: Array<string> = ['', 'Information', '', '', 'Activity'];

export const LifeFeed: React.FC = () => {
	return (
		<section className="section lifefeed">
			<div className="section-wrapper lifefeed-wrapper">
				<div className="container">
					<h2 className="title title_size-m lifefeed-title">Live feed</h2>
					<LifeFeedTable
						tableColumnsNames={homeTableColumnsNames}
						tableData={tableData}
						dateConvert={dateConvert}
						convertDateToString={convertDateToString}
					/>
					<LifeFeedMobile
						tableData={tableData}
						dateConvert={dateConvert}
						convertDateToString={convertDateToString}
					/>
				</div>
			</div>
		</section>
	);
};

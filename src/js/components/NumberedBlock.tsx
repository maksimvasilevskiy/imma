import React from 'react';

type NumberedBlockListT = {
	type: 'list';
	list: { items: string[] };
};

type NumberedBlockParagraphT = {
	type: 'text_bold' | 'text_thin';
	paragraphs: string[];
};

export interface NumberedBlockProps {
	number: string;
	data: Array<NumberedBlockListT | NumberedBlockParagraphT>;
}

export const NumberedBlock = ({ number, data }: NumberedBlockProps) => {
	return (
		<div className="block-numbered">
			<h4 className="title title_size-xs block-numbered__number">{number}</h4>
			<div className="block-numbered__content">
				{/* Renders different content based on data type */}
				{data.map((dataItem) => {
					if (dataItem.type === 'text_bold' || dataItem.type === 'text_thin') {
						return (
							<React.Fragment key={dataItem.paragraphs[0]}>
								{dataItem.paragraphs.map((paragraph) => {
									// If data type is text_thin => font is thin
									// If data type is text_bold => font is bold
									const fontWeightClassName: string =
										dataItem.type === 'text_bold'
											? 'block-numbered__paragraph'
											: 'block-numbered__paragraph_thin';

									return (
										<p
											className={`title title_size-xs ${fontWeightClassName}`}
											dangerouslySetInnerHTML={{ __html: paragraph }}
											key={paragraph}
										></p>
									);
								})}
							</React.Fragment>
						);
					}

					if (dataItem.type === 'list') {
						return (
							<ul className="list block-numbered__list" key={dataItem.list.items[0]}>
								{dataItem.list.items.map((text) => {
									return (
										<li className="list__item block-numbered__item" key={text}>
											{text}
										</li>
									);
								})}
							</ul>
						);
					}

					throw new TypeError(`Data type cannot be called ${dataItem.type}`);
				})}
			</div>
		</div>
	);
};

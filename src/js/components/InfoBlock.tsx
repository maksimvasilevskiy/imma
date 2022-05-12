import React, { useState } from 'react';
import { NumberedBlockProps, NumberedBlock } from './NumberedBlock';
import { ProtocolItem } from './ImmaProtocol';

interface InfoBlockProps extends ProtocolItem {
	blocksCount: number;
}

export const InfoBlock = ({ title, subtitle, blocks, blocksCount }: InfoBlockProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className={`info-block ${isOpen ? 'info-block_closed' : ''}`}>
			<button type="button" className="info-top" onClick={() => setIsOpen((prev) => !prev)}>
				<h3 className="title title_size-s info-top__title">{title}</h3>
				<div className="info-top__btn">
					<span></span>
					<span></span>
				</div>
			</button>
			{subtitle && (
				<div className="info-block__subtitle">
					<p>{subtitle}</p>
				</div>
			)}
			<div className="info-content" data-blocks-count={blocksCount}>
				{blocks.map((block: NumberedBlockProps) => {
					return (
						<NumberedBlock number={block.number} data={block.data} key={block.number} />
					);
				})}
			</div>
		</div>
	);
};

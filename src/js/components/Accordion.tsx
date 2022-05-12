import React, { useState } from 'react';

export type AccordionItemT = {
	id: string;
	question: string;
	answer: string;
};

export const AccordionItem = ({ item }: { item: AccordionItemT }) => {
	const [isActive, setIsActive] = useState<boolean>(false);

	return (
		<li className={`accordion-item ${isActive ? 'accordion-item_open' : ''}`}>
			<button className="accordion-question" onClick={() => setIsActive((prev) => !prev)}>
				<h3 className="title title_size-xs">{item.question}</h3>
				<div className="accordion-question__btn" aria-label="open answer">
					<span></span>
					<span></span>
				</div>
			</button>
			<p className="accordion-answer">{item.answer}</p>
		</li>
	);
};

export const Accordion = ({ items }: { items: Array<AccordionItemT> }) => {
	return (
		<ul className="accordion">
			{items.map((item: AccordionItemT) => {
				return <AccordionItem key={item.id} item={item} />;
			})}
		</ul>
	);
};

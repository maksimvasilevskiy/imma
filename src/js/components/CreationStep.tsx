import React from 'react';

type CreationStepProps = {
	number: string;
	title: string;
	children: JSX.Element | JSX.Element[];
};

export const CreationStep = ({ number, title, children }: CreationStepProps) => {
	return (
		<div className="step">
			<h3 className="title title_size-s step-title">
				<span>{number}</span>
				{title}
			</h3>
			{children}
		</div>
	);
};

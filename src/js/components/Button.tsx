import React from 'react';
import { Link } from 'react-router-dom';

type Properties = {
	text: string;
	action?: () => void;
	to?: string;
	href?: string;
};

interface ButtonProps {
	className: string;
	type: 'button' | 'link' | 'route' | 'submit';
	properties: Properties;
}

const Button = ({ type, className, properties }: ButtonProps) => {
	if (type === 'route') {
		return (
			<Link className={className} to={properties.to}>
				{properties.text}
			</Link>
		);
	} else if (type === 'link') {
		return (
			<a
				href={properties.href}
				className={className}
				onClick={properties.action && properties.action}
			>
				{properties.text}
			</a>
		);
	} else if (type === 'button' || type === 'submit') {
		return (
			<button
				className={className}
				type={type}
				onClick={properties.action && properties.action}
			>
				{properties.text}
			</button>
		);
	}
};

export default Button;

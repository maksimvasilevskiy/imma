import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';

export const Header: React.FC = () => {
	return (
		<header id="header" className="header">
			<div className="header-wrapper">
				<div className="container">
					<Link className="header-logo" to="/">
						<img src={logo} alt="logo"></img>
					</Link>
				</div>
			</div>
		</header>
	);
};

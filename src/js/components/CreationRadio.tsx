import React, { useState, useEffect, useRef } from 'react';

interface IPriceRadio {
	id?: string;
	isFree: boolean;
	price: {
		isFree: boolean;
		dollarValue: null | string;
		ethereumValue: null | string;
	};
	dispatch: React.Dispatch<any>;
	input?: true;
}

export const PriceRadio = ({ id, isFree, price, dispatch, input }: IPriceRadio) => {
	const [maxPrice, setMaxPrice] = useState<number>(50000);

	// Handler controls value of the price input
	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : "";
    if (value === '') {
			if (e.target.name === 'dollar-price') {
				dispatch({ type: 'CHANGE_DOLLAR_PRICE', value: '' });
			}

			if (e.target.name === 'eth-price') {
				dispatch({ type: 'CHANGE_ETHEREUM_PRICE', value: '' });
			}
		}

		if (e.target.name === 'dollar-price') {
			dispatch({ type: 'CHANGE_DOLLAR_PRICE', value: value });
		}

		if (e.target.name === 'eth-price') {
			dispatch({ type: 'CHANGE_ETHEREUM_PRICE', value: value });
		}
		/*
		let value: string = e.target.value;
		let valid = false;

		if (+value || +value === 0) {
			console.log('valid ' + (+value));
			valid = true;
		} else {
			value = value + '0';
			console.log(value);
			if (+value || +value === 0) {
					valid = true;
			}
		}

		if (valid) {

			if (e.target.name === 'dollar-price') {
				dispatch({ type: 'CHANGE_DOLLAR_PRICE', value: +value });
			}

			if (e.target.name === 'eth-price') {
				dispatch({ type: 'CHANGE_ETHEREUM_PRICE', value: +value });
			}
		}*/
	};

	return (
		<label className="step-block step-block__radio-label">
			<input
				className="step-block__radio"
				type="radio"
				name="price"
				onChange={() =>
					dispatch({
						type: 'SET_PRICE_FREE',
						value: isFree
					})
				}
				checked={price.isFree === isFree ? true : false}
			/>
			<div className="step-block__radio-btn">
				<div></div>
			</div>
			<div className="step-block__title-wrapper">
				<h4 className="title title_size-xs step-block__title_radio">
					{isFree ? 'For FREE' : 'Price'}
				</h4>
				{input && (
					<div className="step-block__inputs-wrapper">
						<div className="step-block__input-wrapper step-block__eth-input">
							<input
								className="input step-block__radio-input"
								type="number"
								name="eth-price"
								value={price.ethereumValue}
								onChange={(evt) => handlePriceChange(evt)}
							/>
						</div>
						<div className="step-block__input-wrapper step-block__dollar-input">
							<input
								className="input step-block__radio-input"
								type="number"
								name="dollar-price"
								value={price.dollarValue}
								onChange={(evt) => handlePriceChange(evt)}
							/>
						</div>
					</div>
				)}
			</div>
		</label>
	);
};

enum BlockchainRadioTitles {
	'ethereum' = 'Ethereum ETH',
	'polygon' = 'Polygon'
}

interface IBlockchainRadio {
	type: 'ethereum' | 'polygon';
	blockchain: 'ethereum' | 'polygon';
	dispatch: React.Dispatch<any>;
}

export const BlockchainRadio = ({ type, blockchain, dispatch }: IBlockchainRadio) => {
	const [disabled, setDisabled] = useState<boolean>(false);

	// To enable polygon remove 'step-block_disabled' string from customClassName
	const customClassName: string =
		type === 'ethereum'
			? 'step-block_eth'
			: type === 'polygon'
			? 'step-block_pol step-block_disabled'
			: '';

	// Also to enable polygon remove this function
	useEffect(() => {
		if (type === 'polygon') {
			setDisabled(true);
		}
	}, []);

	return (
		<label className={`step-block step-block__radio-label ${customClassName}`}>
			<input
				className="step-block__radio"
				type="radio"
				name="blockchain"
				onChange={
					disabled
						? null
						: () =>
								dispatch({
									type: 'SET_BLOCKCHAIN_NETWORK',
									value: type
								})
				}
				checked={blockchain === type ? true : false}
			/>
			<div className="step-block__radio-btn">
				<div></div>
			</div>
			<div className="step-block__title-wrapper">
				<h4 className="title title_size-xs step-block__title_radio">
					{BlockchainRadioTitles[type]}
				</h4>
			</div>
			{disabled && <div className="blocker">Will be optional later</div>}
		</label>
	);
};

interface CodeSessionT {
	current: string;
}

interface ISocialRadio {
	type: 'instagram' | 'twitter';
	verification: {
		social: 'instagram' | 'twitter';
		isVerified: boolean;
	};
	dispatch: React.Dispatch<any>;
	session: {
		current: string;
	};
	rid: string;
	sendCode: (api_base_url: string, codeSession: string, userName: string, type_: string, rid: string) => void;
	api_details_ref: {
		current: {
			api_base_url: string;
			api_path: string;
			api_server: string;
			network: string;
			selected: string;
		}
	}
}

export const SocialRadio = ({ type, verification, dispatch, session, rid, sendCode, api_details_ref }: ISocialRadio) => {
	const checkboxRef = useRef(null);
	const [userName, setUserName] = useState<string>('');
	const [isChecked, setIsChecked] = useState<boolean>(
		verification.social === type ? true : false
	);

	useEffect(() => {
		const isChecked = verification.social === type ? true : false;

		setIsChecked(isChecked);
	}, [verification.social]);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {};

	const send_code = async (event) => {
		try {
			console.log("in send_code");
			event.preventDefault();
			if (!userName) return /* alert("no username")*/;
			const type_ = type;
			const codeSession = session.current;
			console.log("session: ", session);
			sendCode(api_details_ref.current.api_base_url, codeSession, userName, type_, rid);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<label className="step-block step-block_social step-block__radio-label">
			<input
				ref={checkboxRef}
				className="step-block__radio"
				type="radio"
				name="social"
				onChange={() =>
					dispatch({
						type: 'SET_SOCIAL',
						value: type
					})
				}
				checked={isChecked}
			/>
			<div className="step-block__radio-btn">
				<div></div>
			</div>
			<form className="step-block__social-form" action="">
				<h4 className="title title_size-xs step-block__title_radio">
					{type[0].toUpperCase() + type.slice(1)}
				</h4>
				<div className="step-block__social-input" data-input={type}>
					<input
						className="input"
						type="text"
						name="social_username"
						value={userName}
						onChange={(evt) => setUserName(evt.target.value)}
						required
					/>
				</div>
				<button
					type="submit"
					className="btn-arrow step-block__btn"
					disabled={!isChecked}
					onClick={(evt) => send_code(evt)}
				>
					Send me the code
				</button>
			</form>
		</label>
	);
};

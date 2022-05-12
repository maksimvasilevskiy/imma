import React from 'react';
import { Wallets, State } from '../helpers/creationReducer';

interface ICreationFormProps {
	title: string;
	state: any;
	dispatch: React.Dispatch<any>;
	wallet: string;
}

export const CreationForm = ({ title, state, dispatch, wallet }: ICreationFormProps) => {
	// We need this value to get correct state fields using Wallets enum
	const walletState: string = Wallets[wallet];

	return (
		<div className="step-block__wrapper">
			<form action="" className="form step-block">
				<h4 className="title title_size-xs step-block__title">{title}</h4>
				<input
					className="input step-block__input"
					type="text"
					name="wallet"
					value={state.wallets[walletState].walletNumber}
					onChange={(evt) =>
						dispatch({
							type: 'SET_WALLET_NUMBER',
							wallet: wallet,
							value: evt.target.value
						})
					}
					required
				/>
				<button
					type="submit"
					className="btn-arrow step-block__submit"
					disabled={state.wallets[walletState].isVerified}
					onClick={(evt) =>
						dispatch({
							type: 'VERIFY_WALLET',
							wallet: wallet,
							event: evt
						})
					}
				>
					Confirm
				</button>
			</form>
		</div>
	);
};

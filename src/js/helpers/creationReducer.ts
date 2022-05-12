import { initialState } from '../components/Creation';

// Adding types to reducer
export type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V;

export type ActionType =
	| Action<'SET_WALLET_NUMBER', { wallet: string; value: string }>
	| Action<'VERIFY_WALLET', { wallet: string; event: React.MouseEvent<HTMLButtonElement> }>
	| Action<'ADD_CUSTOM_WALLET', {}>
	| Action<'SET_PRICE_FREE', { value: boolean }>
	| Action<'CHANGE_DOLLAR_PRICE', { value: number }>
	| Action<'CHANGE_ETHEREUM_PRICE', { value: number }>
	| Action<'SET_BLOCKCHAIN_NETWORK', { value: 'ethereum' | 'polygon' }>
	| Action<'SET_SOCIAL', { value: 'instagram' | 'twitter' }>
	| Action<'CLEAN_FORM', {}>;

export enum Wallets {
	original = 'originalWallet',
	creator = 'creatorWallet',
	custom = 'customWallet'
}

type Wallet = {
	walletNumber: '' | string;
	isVerified: boolean;
};

export interface State {
	wallets: {
		originalWallet: Wallet;
		creatorWallet: Wallet;
		customWallet?: Wallet;
	};
	price: {
		isFree: boolean;
		dollarValue: null | number;
		ethereumValue: null | number;
	};
	blockchain: 'ethereum' | 'polygon';
	video: null | File;
	signature: null | File;
	verification: {
		social: 'instagram' | 'twitter';
		isVerified: boolean;
	};
}

export function reducer(state: State, action: ActionType) {
	switch (action.type) {
		case 'SET_WALLET_NUMBER': {
			const newState = { ...state };

			newState.wallets[Wallets[action.wallet]] = {
				walletNumber: action.value,
				isVerified: false
			};

			return newState;
		}
		case 'VERIFY_WALLET': {
			action.event.preventDefault();

			const newState = { ...state };

			let currentWallet = newState.wallets[Wallets[action.wallet]];

			// Wallet check using regexp
			if (currentWallet.walletNumber.match(/^0x[a-fA-F0-9]{40}$/)) {
				newState.wallets[Wallets[action.wallet]] = {
					walletNumber: currentWallet.walletNumber,
					isVerified: true
				};
			}
			console.log(state.wallets[Wallets[action.wallet]]);

			return newState;
		}
		case 'ADD_CUSTOM_WALLET': {
			return {
				...state,
				wallets: {
					originalWallet: {
						walletNumber: state.wallets.originalWallet.walletNumber,
						isVerified: state.wallets.originalWallet.isVerified
					},
					creatorWallet: {
						walletNumber: state.wallets.creatorWallet.walletNumber,
						isVerified: state.wallets.creatorWallet.isVerified
					},
					customWallet: {
						walletNumber: '',
						isVerified: false
					}
				}
			};
		}
		case 'SET_PRICE_FREE': {
			return {
				...state,
				price: {
					isFree: action.value,
					dollarValue: state.price.dollarValue,
					ethereumValue: state.price.ethereumValue
				}
			};
		}
		case 'CHANGE_DOLLAR_PRICE': {
			const dollarValue: number = action.value;
			const ethereumValue: number = convertPrice(dollarValue, 'eth');

			return {
				...state,
				price: {
					isFree: state.price.isFree,
					dollarValue: dollarValue,
					ethereumValue: ethereumValue
				}
			};
		}
		case 'CHANGE_ETHEREUM_PRICE': {
			const ethereumValue: number = action.value;
			const dollarValue: number = convertPrice(ethereumValue, 'dol');

			return {
				...state,
				price: {
					isFree: state.price.isFree,
					dollarValue: dollarValue,
					ethereumValue: ethereumValue
				}
			};
		}
		case 'SET_BLOCKCHAIN_NETWORK': {
			return {
				...state,
				blockchain: action.value
			};
		}
		case 'SET_SOCIAL': {
			return {
				...state,
				verification: {
					social: action.value,
					isVerified: state.verification.isVerified
				}
			};
		}
		case 'CLEAN_FORM': {
			return {
				...initialState,
				wallets: {
					originalWallet: {
						walletNumber: '',
						isVerified: false
					},
					creatorWallet: {
						walletNumber: '',
						isVerified: false
					}
				}
			};
		}
		default: {
			throw new TypeError('Action type is uncorrect');
		}
	}
}

// TODO: Add convert using API
// Crypto convert functions
function convertPrice(price: number, to: 'dol' | 'eth'): number {
	const factor: number = 2795.2857;

	switch (to) {
		case 'dol': {
			const res: number = +(price * factor).toFixed(2);
			return res;
		}
		case 'eth': {
			const res: number = +(price / factor).toFixed(5);
			return res;
		}
		default: {
			throw new Error(`parameter 'to' is incorrect`);
		}
	}
}

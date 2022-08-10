import { initialState } from '../pages/Home';

// Adding types to reducer
export type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V;

export type ActionType =
	| Action<'SET_PRICE_FREE', { value: boolean }>
	| Action<'CHANGE_DOLLAR_PRICE', { value: string }>
	| Action<'CHANGE_ETHEREUM_PRICE', { value: string }>
	| Action<'SET_BLOCKCHAIN_NETWORK', { value: 'ethereum' | 'polygon' }>
	| Action<'SET_SOCIAL', { value: 'instagram' | 'twitter' }>
	| Action<'CLEAN_FORM', {}>
	| Action<'SET_VIDEO', { value: Blob }>
	| Action<'SET_SIGNATURE', { value: File }>
	| Action<'SET_ORIGINAL_NFT', { value: string }>
	| Action<'SET_CREATOR_WALLET', { value: string }>
	| Action<'SET_PARTNER_WALLET', { value: string }>
	| Action<'ADD_PARTNER_WALLET', {}>
	| Action<'SET_ORIGINAL_NFT_VERIFIED', { value: boolean }>
	| Action<'SET_CREATOR_WALLET_VERIFIED', { value: boolean }>
	| Action<'SET_PARTNER_WALLET_VERIFIED', { value: boolean }>
	| Action<'SET_SOCIAL_VERIFIED', { value: boolean }>;

export interface State {
	price: {
		isFree: null | boolean;
		dollarValue: null | string;
		ethereumValue: null | string;
	};
	originalNft: null | string;
	originalNftVerified: boolean;
	creatorWallet: null | string;
	creatorWalletVerified: boolean;
	partnerWallet?: null | string;
	partnerWalletVerified: boolean;
	hasPartnerWallet: boolean;
	blockchain: null | 'ethereum' | 'polygon';
	video: null | Blob;
	signature: null | File;
	verification: {
		social: null | 'instagram' | 'twitter';
		isVerified: boolean;
	};
}

export function reducer(state: State, action: ActionType) {
	switch (action.type) {
		case 'SET_ORIGINAL_NFT': {
			return {
				...state,
				originalNft: action.value
			};
		}
		case 'SET_ORIGINAL_NFT_VERIFIED': {
			return {
				...state,
				originalNftVerified: action.value
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
			const dollarValue: string = action.value;
			const ethereumValue: string = convertPrice(dollarValue, 'eth');
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
			const ethereumValue: string = action.value;
			const dollarValue: string = convertPrice(ethereumValue, 'dol');

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
		case 'SET_VIDEO': {
			return {
				...state,
				video: action.value
			};
		}
		case 'SET_SIGNATURE': {
			return {
				...state,
				signature: action.value
			};
		}
		case 'SET_CREATOR_WALLET': {
			return {
				...state,
				creatorWallet: action.value
			};
		}
		case 'SET_CREATOR_WALLET_VERIFIED': {
			return {
				...state,
				creatorWalletVerified: action.value
			};
		}
		case 'SET_PARTNER_WALLET': {
			return {
				...state,
				partnerWallet: action.value
			};
		}
		case 'ADD_PARTNER_WALLET': {
			return {
				...state,
				hasPartnerWallet: true
			};
		}
		case 'SET_PARTNER_WALLET_VERIFIED': {
			return {
				...state,
				partnerWalletVerified: action.value
			};
		}
		case 'SET_SOCIAL_VERIFIED': {
			return {
				...state,
				verification: {
					social: state.verification.social,
					isVerified: true
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
function convertPrice(price: string, to: 'dol' | 'eth'): string {
	const factor: number = 2795.2857;
	if (price === '') return '';
	switch (to) {
		case 'dol': {
			const res: number = +(parseFloat(price) * factor).toFixed(2);
			return res.toString();
		}
		case 'eth': {
			const res: number = +(parseFloat(price) / factor).toFixed(5);
			return res.toString();
		}
		default: {
			throw new Error(`parameter 'to' is incorrect`);
		}
	}
}

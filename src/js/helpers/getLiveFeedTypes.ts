export type DateT = {
	last_update: number;
	minted: any;
};

export type CreatorT = {
	wallet: string;
	social: string;
	avatar: null | string;
	path: null | string;
};

export type MetaDataT = {
	name: string;
	description: string;
	image: string;
	animation_url: string;
	attributes?: Array<{ trait_type: string; value: number }>;
};

export type OwnerT = {
	wallet: string;
	social: null | string;
	avatar: null | string;
	path: null | string;
};

export type ActivityItemT = {
	epoch: number;
	event: string;
	from: string;
	to: string;
	priceETH: null | number;
	icon: null | string;
};

export interface INFT {
	date: DateT;
	creator: null | CreatorT;
	minted: false;
	metadata: null | MetaDataT;
	symbol: string;
	price_history: any[]; // TODO: disable "any"
	owner: OwnerT;
}

export interface NFTA extends INFT {
	token_address: string;
	token_id: string;
	price_history: any[];
	owner: OwnerT;
}

export interface Result {
	index: string;
	uid: string;
	requested: string;
	coupled: boolean;
	inft: INFT;
	nfta: NFTA;
	activity: ActivityItemT[];
}

export interface Response {
	status: number;
	message: string;
	domain: string;
	results: Result[];
}

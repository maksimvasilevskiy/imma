import React, { useState, useReducer, useEffect } from 'react';
import { SortNft } from '../components/SortNft';
import { AllNftTable, AllNftMobile } from '../components/AllNftTable';
import { tableData, ITableData } from '../helpers/nftTableData';
import { Action } from '../helpers/creationReducer';

export type TableActionType =
	| Action<'SORT_SEARCH', {}>
	| Action<'SORT_PARAMETER_CHANGE', { value: string }>
	| Action<'SORT_SEARCH_CHANGE', { value: string }>;

export type AllNftStateT = {
	searchValue: string;
	sortValue: string;
	currentTableData: Array<ITableData>;
};

type SearchByValues = [string, string, string];

const initialState: AllNftStateT = {
	searchValue: '',
	sortValue: 'address',
	currentTableData: tableData
};

// !"Sort by" filters state.currentTableData; Search filters initialState.currentTableData
function reducer(state: AllNftStateT, action: TableActionType) {
	switch (action.type) {
		case 'SORT_SEARCH_CHANGE': {
			return {
				...state,
				searchValue: action.value
			};
		}
		case 'SORT_SEARCH': {
			const value: string = state.searchValue.toLowerCase();
			const nftData: Array<ITableData> = initialState.currentTableData;

			const sortedNftData: Array<ITableData> = nftData.filter((row) => {
				const [author, originalAddress, immaAddress]: SearchByValues = [
					row.author.toLowerCase(),
					row.token.toLowerCase(),
					row.hash.toLowerCase()
				];

				// If none of parameters has substring (value), removes an nft from table
				return (
					author.includes(value) ||
					originalAddress.includes(value) ||
					immaAddress.includes(value)
				);
			});

			return {
				...state,
				currentTableData: sortedNftData
			};
		}
		case 'SORT_PARAMETER_CHANGE': {
			const value: string = action.value;
			const nftData: Array<ITableData> = state.currentTableData;

			const sortedNftData: Array<ITableData> = nftData.sort((a, b) => {
				const prevValue: any = a[`${value}`];
				const nextValue: any = b[`${value}`];

				return prevValue >= nextValue ? 1 : -1;
			});

			return {
				...state,
				sortValue: value,
				currentTableData: sortedNftData
			};
		}
		default: {
			throw new TypeError('Action type is uncorrect');
		}
	}
}

export const AllImmaNft: React.FC = () => {
	const [allTableVisible, setAllTableVisible] = useState<boolean>(false);
	const [state, dispatch] = useReducer(reducer, initialState);

	// Initial sorting
	useEffect(() => dispatch({ type: 'SORT_PARAMETER_CHANGE', value: state.sortValue }), []);

	return (
		<section className="nfts">
			<div className="nfts-wrapper">
				<div className="container">
					<h1 className="title title_size-m nfts__title">All IMMA NFT</h1>
					<SortNft state={state} dispatch={dispatch} />
					<AllNftTable
						tableData={state.currentTableData}
						allTableVisible={allTableVisible}
					/>
					<AllNftMobile
						tableData={state.currentTableData}
						allTableVisible={allTableVisible}
					/>
					<div className="view-more">
						<button
							type="button"
							className="view-more__btn"
							onClick={() => setAllTableVisible(true)}
							style={
								allTableVisible ? { display: 'none' } : { display: 'inline-block' }
							}
						>
							View more
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

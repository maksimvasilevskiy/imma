import React, { useState, useReducer, useEffect } from 'react';
import { SortNft } from '../components/SortNft';
import { AllNftTable, AllNftMobile } from '../components/AllNftTable';
import { tableData, ITableData } from '../helpers/nftTableData';
import { Action } from '../helpers/creationReducer';
import { BASE_URL, BLOCKCHAIN, NETWORK_NAME } from '../api/Api';
import axios from 'axios';

export type TableActionType =
	| Action<'SET_CURRENT_DATA', { value: null | any }>
	| Action<'SET_LOADED_DATA', { value: null | any }>
	| Action<'SORT_SEARCH', {}>
	| Action<'SORT_PARAMETER_CHANGE', { value: string }>
	| Action<'SORT_SEARCH_CHANGE', { value: string }>;

export type AllNftStateT = {
	searchValue: string;
	sortValue: string;
	loadedTableData: Array<ITableData>;
	currentTableData: Array<ITableData>;
	searchTableData: Array<ITableData>;
};

type SearchByValues = [string, string/*, string*/];

const initialState: AllNftStateT = {
	searchValue: '',
	sortValue: 'address',
	loadedTableData: null,
	currentTableData: null,
	searchTableData: null,
};

// !"Sort by" filters state.currentTableData; Search filters initialState.currentTableData
function reducer(state: AllNftStateT, action: TableActionType) {
	switch (action.type) {
		case 'SET_CURRENT_DATA': {
			return {
				...state,
				currentTableData: action.value
			};
		}
		case 'SET_LOADED_DATA': {
			return {
				...state,
				loadedTableData: action.value
			};
		}
		case 'SORT_SEARCH_CHANGE': {
			return {
				...state,
				searchValue: action.value
			};
		}
		case 'SORT_SEARCH': {
			const value: string = state.searchValue.toLowerCase();
			const nftData: Array<any> = state.searchTableData;

			const sortedNftData: Array<any> = nftData.filter((row) => {
				const [author, originalAddress/*, immaAddress*/]: SearchByValues = [
					row.inft.metadata.name.toLowerCase(),
					row.nfta.token_address.toLowerCase()
					//row.hash.toLowerCase()
				];

				// If none of parameters has substring (value), removes an nft from table
				return (
					author.includes(value) ||
					originalAddress.includes(value)// ||
					//immaAddress.includes(value)
				);
			});

			return {
				...state,
				currentTableData: sortedNftData
			};
		}
		case 'SORT_PARAMETER_CHANGE': {
			const value: string = action.value;
			console.log(value);
			const nftData: Array<ITableData> = state.currentTableData;

			if (nftData) {
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
			} else {
				return;
			}
		}
		default: {
			throw new TypeError('Action type is uncorrect');
		}
	}
}

export const AllImmaNft = () => {
	const ITEMS_PER_PAGE = 10;
	const [allTableVisible, setAllTableVisible] = useState<boolean>(false);
	const [nextPage, setNextPage] = useState('');
	const [nextSearchPage, setNextSearchPage] = useState('');
	const [currentPageNumber, setCurrentPageNumber] = useState(1);
	const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleViewMore = () => {
		if (state.searchValue) {
			getData(state.loadedTableData, nextPage, currentPageNumber+1, state.searchValue);
		} else {
			getData(state.loadedTableData, nextPage, currentPageNumber+1);
		}
		setCurrentPageNumber(currentPageNumber+1);
	}

	const getData = (data = [], _nextPage = '', currentPageNumber = 1, searchValue = '', newSearch = false) => {


		let _isAllDataLoaded = isAllDataLoaded;
		if (newSearch) {
			_isAllDataLoaded = false;
			setAllTableVisible(false);
		}
		let currentItemsNumber = ITEMS_PER_PAGE * currentPageNumber;

		//console.log(data);
		/*console.log('searchValue');
		console.log(searchValue);
		console.log('newSearch');
		console.log(newSearch);
		console.log('_isAllDataLoaded');
		console.log(_isAllDataLoaded);
		console.log('allTableVisible');
		console.log(allTableVisible);
		console.log('currentItemsNumber');
		console.log(currentItemsNumber);*/

		if (!_isAllDataLoaded && data.length < currentItemsNumber) {
			const config = {
				method: 'get',
				url: `${BASE_URL}/api/${BLOCKCHAIN}/${NETWORK_NAME}/getLiveFeed`,
				params: {
					nextpage: `"${_nextPage}"`,
					search: ''
				}
			};
			//console.log('config');
			//console.log(config);
			if (searchValue) {
				config.params.search = searchValue;
			}
			axios(config)
				.then((response) => {
					//console.log('response.data');
					//console.log(response.data);
					/*console.log('more nextpage');
					console.log(response.data.nextpage);*/
					if (!response.data.nextpage) {
						//console.log('ВСЯ ДАТА ЗАГРУЖЕНА');
						setIsAllDataLoaded(true);
					}
					data = data.concat(response.data.results);
					dispatch({ type: 'SET_LOADED_DATA', value: data });
					setNextPage(response.data.nextpage);
					dispatch({ type: 'SET_CURRENT_DATA', value: data.slice(0, currentItemsNumber) });
					dispatch({ type: 'SORT_PARAMETER_CHANGE', value: state.sortValue });
					/*console.log('loaded data');
					console.log(data);
					console.log('current data');
					console.log(data.slice(0, currentItemsNumber));*/
					if (response.data.nextpage && data.length < currentItemsNumber) {
						getData(data, response.data.nextpage, currentPageNumber, searchValue, newSearch);
					} else {
						if (!response.data.nextpage) {
							dispatch({ type: 'SET_CURRENT_DATA', value: data.slice(0, currentItemsNumber) });
							dispatch({ type: 'SORT_PARAMETER_CHANGE', value: state.sortValue });
							/*console.log('search data else');
							console.log(data);
							console.log('current data else');
							console.log(data.slice(0, currentItemsNumber));*/
							if (data.length <= currentItemsNumber) {
								//console.log('ВСЯ ТАБЛИЦА ОТОБРАЖЕНА');
								setAllTableVisible(true);
							}
						}
					}
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			dispatch({ type: 'SET_CURRENT_DATA', value: data.slice(0, currentItemsNumber) });
			dispatch({ type: 'SORT_PARAMETER_CHANGE', value: state.sortValue });
			/*console.log('search data else');
			console.log(data);
			console.log('current data else');
			console.log(data.slice(0, currentItemsNumber));*/
			if (_isAllDataLoaded && data.length <= currentItemsNumber) {
				setAllTableVisible(true);
			}
		}
	}

	const handleSearch = async () => {
		setNextPage('');
		setCurrentPageNumber(1);
		setIsAllDataLoaded(false);
		setAllTableVisible(false);
		dispatch({ type: 'SET_LOADED_DATA', value: [] });
		dispatch({ type: 'SET_CURRENT_DATA', value: [] });
		const searchValue = state.searchValue;
		console.log(state.searchValue);
		getData([], '', 1, searchValue, true);
	}

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => dispatch({ type: 'SORT_PARAMETER_CHANGE', value: state.sortValue }), []);

	return (
		<section className="nfts">
			<div className="bg-lights"></div>
			<div className="nfts-wrapper">
				<div className="container">
					<h1 className="title title_size-m nfts__title">All IMMA NFT</h1>
					{(state && state.currentTableData) ? (
					<>
					<SortNft state={state} dispatch={dispatch} handleSearch={handleSearch} />
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
							onClick={() => handleViewMore()}
							style={
								allTableVisible ? { display: 'none' } : { display: 'inline-block' }
							}
						>
							View more
						</button>
					</div>
					</>
					) : ''}
				</div>
			</div>
		</section>
	);
};

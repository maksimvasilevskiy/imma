import React, { useEffect, useRef } from 'react';
import { TableActionType, AllNftStateT } from '../pages/AllImmaNft';

interface SortNftProps {
	state: AllNftStateT;
	dispatch: React.Dispatch<TableActionType>;
}

type SortOptionsT = {
	id: string;
	text: string;
	tag: string;
};

const sortOptions: Array<SortOptionsT> = [
	{
		id: '1',
		text: 'IMMA NFT token address',
		tag: 'address'
	},
	{
		id: '2',
		text: 'IMMA NFT author',
		tag: 'author'
	}
];

export const SortNft = ({ state, dispatch }: SortNftProps) => {
	const searchRef = useRef(null);

	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			if (e.code === 'Enter') {
				searchRef.current.click();
			}
		});

		return () => {
			window.removeEventListener('keydown', (e) => {
				if (e.code === 'Enter') {
					searchRef.current.click();
				}
			});
		};
	}, []);

	return (
		<div className="nfts-sort">
			<div className="nfts-sort__search-block">
				<div className="nfts-sort__search">
					<input
						className="input"
						type="text"
						name="search"
						placeholder="Search..."
						value={state.searchValue}
						onChange={(evt) =>
							dispatch({ type: 'SORT_SEARCH_CHANGE', value: evt.target.value })
						}
					/>
					<button
						type="button"
						className="nfts-sort__search-btn"
						onClick={() => dispatch({ type: 'SORT_SEARCH' })}
						ref={searchRef}
					>
						<svg
							width="17"
							height="19"
							viewBox="0 0 17 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="7.04395" cy="7.40453" r="6.40723" stroke="white" />
							<path d="M11 12.5654L16.3405 17.9059" stroke="white" />
						</svg>
					</button>
				</div>
				<p className="nfts-sort__search-note">
					The search is carried out by IMMA NFT token address, by original NFT token
					address or by creator name.
				</p>
			</div>
			<div className="nfts-sort__sort">
				Sort by:
				<div className="nfts-sort__select-wrapper">
					<select
						className="nfts-sort__select"
						value={state.sortValue}
						onChange={(evt) =>
							dispatch({ type: 'SORT_PARAMETER_CHANGE', value: evt.target.value })
						}
					>
						{sortOptions.map((option) => {
							return (
								<option value={option.tag} key={option.id}>
									{option.text}
								</option>
							);
						})}
					</select>
				</div>
			</div>
		</div>
	);
};

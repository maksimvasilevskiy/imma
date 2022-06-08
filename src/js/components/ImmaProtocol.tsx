import React from 'react';
import { InfoBlock } from './InfoBlock';
import { NumberedBlockProps } from './NumberedBlock';

export interface ProtocolItem {
	title: string;
	subtitle?: string;
	blocks: Array<NumberedBlockProps>;
}

const protocolList: Array<ProtocolItem> = [
	{
		title: 'Creations',
		subtitle:
			'Once the IMMA NFT is created it will be sent to the same wallet of the original NFT.',
		blocks: [
			{
				number: '01',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'The wallet owner will receive a transaction request to his wallet. He can both accept or reject it.'
						]
					}
				]
			},
			{
				number: '02',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'The gas fee and transaction fee should be already paid by then, so in this transaction the original NFT wallet owner should not pay anything, just to accept the IMMA NFT to the wallet.'
						]
					}
				]
			}
		]
	},
	{
		title: 'Transections and ownership of IMMA NFT',
		subtitle: 'The original NFT and it’s related IMMA NFT are meant to be together.',
		blocks: [
			{
				number: '01',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'IMMA NFT is always tracking the current wallet of the original NFT.'
						]
					}
				]
			},
			{
				number: '02',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'The price for the related IMMA NFT is mandatory to be equal to the same price of the original NFT.'
						]
					}
				]
			},
			{
				number: '03',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'There are 7 days from the time the original NFT and IMMA NFT separate till the owner of the original NFT can repurchase the IMMA NFT.'
						]
					}
				]
			}
		]
	},
	{
		title: 'Special cases',
		subtitle: '',
		blocks: [
			{
				number: '01',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'As long as the original NFT and IMMA NFT are not "consolidated", the price of the IMMA NFT will be equal to the highest bid out of all transactions that took place from the moment the original NFT and IMMA NFT were separated.'
						]
					}
				]
			},
			{
				number: '02',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'Every new transaction of the original NFT is restarting the 7 days window for the current owner of the original NFT to purchase IMMA NFT from its current owner.'
						]
					}
				]
			},
			{
				number: '03',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'Once the 7 days window is over,  IMMA NFT will automatically be moved to the imma.love trust-wallet. '
						]
					}
				]
			}
		]
	},
	{
		title: 'Restoring IMMA NFT from imma.love trust wallet',
		subtitle:
			'When the 7 days passed and IMMA NFT didn’t "unite" in the existing original NFT wallet, IMMA NFT is transferred to the imma.love trust wallet.',
		blocks: [
			{
				number: '01',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'The current owner of the original NFT can claim back the ownership of the related IMMA NFT at any time.'
						]
					}
				]
			},
			{
				number: '02',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'The price of the related IMMA NFT, in this case, will be 200% of the highest price that the original NFT has been sold for since the last time that both NFTs were together in the same wallet.'
						]
					}
				]
			}
		]
	},
	{
		title: 'Beneficiaries of IMMA NFT transactions',
		subtitle:
			'In every IMMA NFT transaction, the total payment is divided into several associates automatically depending on the purchase source:',
		blocks: [
			{
				number: '01',
				data: [
					{
						type: 'text_bold',
						paragraphs: ['Purchase from the first transaction:']
					},
					{
						type: 'list',
						list: {
							items: [
								'79%-89% IMMA NFT creator wallet ',
								'10% Broker wallet (if there is)',
								'1% Charity for needed mothers',
								'10% IMMA project'
							]
						}
					}
				]
			},
			{
				number: '02',
				data: [
					{
						type: 'text_bold',
						paragraphs: ['Purchase from the original NFT owner']
					},
					{
						type: 'list',
						list: {
							items: [
								'69%-79% IMMA NFT seller',
								'10%  IMMA NFT creator wallet',
								'10% Broker wallet (if there is)',
								'1% Charity for needed mothers',
								'10% IMMA project'
							]
						}
					}
				]
			},
			{
				number: '03',
				data: [
					{
						type: 'text_bold',
						paragraphs: ['Purchase from the imma.love trust wallet']
					},
					{
						type: 'text_thin',
						paragraphs: [
							'In this case, the IMMA NFT price is 200% of the last price offered.'
						]
					},
					{
						type: 'list',
						list: {
							items: [
								'33%-43% IMMA NFT last owner',
								'10% Broker wallet (if there is)',
								'45% IMMA project',
								'10% IMMA NFT creator wallet',
								'2% Charity for needed mothers'
							]
						}
					}
				]
			}
		]
	},
	{
		title: 'Gass fees for mint and transactions',
		subtitle: '',
		blocks: [
			{
				number: '01',
				data: [
					{
						type: 'text_bold',
						paragraphs: ['Mint, first transaction and payment fees']
					},
					{
						type: 'text_thin',
						paragraphs: [
							'Once you finish the creation process in the web app, your IMMA NFT will be on “pending” status.',
							'After clicking “create” you will be redirected to the IMMA NFT page.',
							'Anyone can release the IMMA NFT. Once it’s done - the IMMA NFT will be sent to the wallet of the original NFT.',
							'In order to release the IMMA NFT click the “Release to blockchain” and pair your Meta-mask wallet.',
							'The releaser will have to pay both mint & first transaction fees, and the price for the IMMA NFT in case the creator demanded such.'
						]
					}
				]
			},
			{
				number: '02',
				data: [
					{
						type: 'text_bold',
						paragraphs: [
							'Claim ownership for your IMMA NFT for your original NFT from IMMA trest-wallet:'
						]
					},
					{
						type: 'text_thin',
						paragraphs: [
							'The current owner of the original NFT can claim back the ownership of the related IMMA NFT at any time.',
							'In order to claim your IMMA NFT, browse the IMMA NFT page. (In case you don’t have the link you can search it on the homepage > all IMMA NFT).',
							'On the page, click on “Claim ownership”, pair your Meta-mask wallet and accept the transaction. '
						]
					}
				]
			},
			{
				number: '03',
				data: [
					{
						type: 'text_bold',
						paragraphs: ['Other transaction fees']
					},
					{
						type: 'text_thin',
						paragraphs: [
							'On any other transaction than the first one, the fees will be paid by the new owner (buyer) of IMMA NFT. '
						]
					}
				]
			}
		]
	}
];

export const ImmaProtocol: React.FC = () => {
	return (
		<section className="section protocol">
			<div className="section-wrapper protocol-wrapper">
				<div className="container">
					<h2 className="title title_size-m protocol-title">IMMA protocol</h2>
					{protocolList.map((item) => {
						return (
							<InfoBlock
								title={item.title}
								subtitle={item.subtitle}
								blocks={item.blocks}
								blocksCount={item.blocks.length}
								key={item.title}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
};

import React from 'react';
import { Accordion, AccordionItemT } from './Accordion';
import { FaqForm } from './FaqForm';

const faqList: Array<AccordionItemT> = [
	{
		id: '1',
		question: 'If I don’t the owner of the original NFT, can I own the IMMA NFT?',
		answer: 'No. Only when you are the owner of the original NFT, you can become the current owner of the IMMA NFT.'
	},
	{
		id: '2',
		question: 'Where can I claim IMMA NFT to my wallet if I have its original NFT?',
		answer: 'You can claim IMMA NFT on the site. At the beginning of the page, there is a "to all IMMA NFT" button that will lead you to the table of all IMMA NFTs and there you can find the specific IMMA NFT you are looking for, and make a loan minted or claim it.'
	},
	{
		id: '3',
		question: 'When does IMMA NFT return to IMMA.love trust wallet?',
		answer: 'When 7 days passed and IMMA NFT didn’t "unite" in the existing original NFT wallet, IMMA NFT is transferred to the imma.love trust wallet.'
	},
	{
		id: '4',
		question: 'How does IMMA NFT help me increase the value of existing NFT?',
		answer: 'IMMA NFT gives sentimental, personal and emotional value for the existing NFT. With the help of the video and dedication, a greater value is created for the NFT.'
	},
	{
		id: '5',
		question: 'What if I didn’t find the question I was looking for?',
		answer: 'You can contact us using the form on the right. Please enter your email and your question there, and we will get back to you as soon as possible.'
	}
];

export const Faq: React.FC = () => {
	return (
		<section className="section faq">
			<div className="section-wrapper faq-wrapper">
				<div className="container">
					<h2 className="title title_size-m faq-title">FAQ</h2>
					<div className="faq-content">
						<Accordion items={faqList} />
						<FaqForm />
					</div>
				</div>
			</div>
		</section>
	);
};

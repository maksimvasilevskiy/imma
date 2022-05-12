import React from 'react';

export const FaqForm: React.FC = () => {
	return (
		<div className="faq-form__wrapper">
			<div className="faq-form__note">
				<p>Didn't find an answer to&nbsp;your question?</p>
				<p>
					Write to us and <span>we will answer</span> immediately!
				</p>
			</div>
			<form className="faq-form" action="">
				<label className="faq-form__label">
					Name
					<input className="faq-form__input" id="name" type="text" name="name" />
				</label>
				<label className="faq-form__label">
					E-mail*
					<input className="faq-form__input" id="email" type="email" name="email" />
				</label>
				<label className="faq-form__label">
					Your Question
					<input className="faq-form__input" id="question" type="text" name="question" />
				</label>
				<div className="faq-form__submit-wrapper">
					<button className="btn-arrow faq-form__submit" type="submit">
						Send
					</button>
				</div>
			</form>
		</div>
	);
};

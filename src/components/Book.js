import React from 'react';
import { BookShelfChanger } from './BookShelfChanger';

export const Book = ({ url, category, title, authors}) => {
	const styles = {
		width: 128,
		height: 193,
		backgroundImage: `url('${url}')`,
	};

	return (
		<div className="book">
			<div className="book-top">
				<div className="book-cover" style={styles}></div>
				<BookShelfChanger category={category}/>
			</div>
			<div className="book-title">{title}</div>
			<div className="book-authors">{authors}</div>
		</div>
	)
};

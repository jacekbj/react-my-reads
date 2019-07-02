import React from 'react';

export const Book = ({ book, children }) => {
	const { imageLinks, title, authors} = book;
	const styles = {
		width: 128,
		height: 193,
		backgroundImage: `url('${imageLinks.thumbnail}')`,
	};

	return (
		<div className="book">
			<div className="book-top">
				<div className="book-cover" style={styles}></div>
				{children}
			</div>
			<div className="book-title">{title}</div>
			<div className="book-authors">{authors}</div>
		</div>
	)
};

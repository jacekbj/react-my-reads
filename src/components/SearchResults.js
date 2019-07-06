import React from 'react';
import { Book } from './Book';

export const SearchResults = ({books}) => {
	const bookComps = books.map(book => <li key={book.id}><Book book={book}/></li>);

	return (
		<ol className="books-grid">
			{bookComps}
		</ol>
	)
};

import React from 'react';
import { Book } from './Book';
import { BookshelfChanger } from './BookshelfChanger';

export const Bookshelf = ({shelfId, shelves, books}) => {
	const shelfName = shelves.filter(shelf => shelf.id === shelfId)[0].name;

	return (
		<div className="bookshelf">
			<h2 className="bookshelf-title">{shelfName}</h2>
			<div className="bookshelf-books">
				<ol className="books-grid">
					{books.map(book => {
						return (
							<li key={book.title}>
								<Book book={book}>
									<BookshelfChanger
										shelves={shelves}
										shelfId={shelfId}
									/>
								</Book>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	)
};

import React from 'react';
import { Book } from './Book';
import { BookshelfChanger } from './BookshelfChanger';
import { connect } from 'react-redux';
import {updateShelf} from '../actions';

const comp = ({shelfId, shelves, books, update}) => {
	const shelfName = shelves.filter(shelf => shelf.id === shelfId)[0].name;

	return (
		<div className="bookshelf">
			<h2 className="bookshelf-title">{shelfName}</h2>
			<div className="bookshelf-books">
				<ol className="books-grid">
					{books.map(book => {
						return (
							<li key={book.id}>
								<Book book={book}>
									<BookshelfChanger
										shelves={shelves}
										shelfId={shelfId}
										update={(shelf) => update(book.id, shelf)}
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

export const Bookshelf = connect(
	null,
	(dispatch) => ({
		update: (bookId, shelf) => dispatch(updateShelf(bookId, shelf)),
	}),
)(comp);

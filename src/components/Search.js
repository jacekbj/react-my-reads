import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {resetSearch, searchBooks} from '../actions';
import {SearchResults} from './SearchResults';

const comp = ({search, reset, results}) => {
	useEffect(() => reset, []);

	return (
		<div className="search-books">
			<div className="search-books-bar">
				<Link to="/">
					<button className="close-search">Close</button>
				</Link>
				<div className="search-books-input-wrapper">
					<input type="text" placeholder="Search by title or author" onChange={(e) => search(e.target.value)}/>
				</div>
			</div>
			<div className="search-books-results">
				<ol className="books-grid"></ol>
			</div>
			{ results.length ? <SearchResults books={results}/> : ''}
		</div>
	)
};

export const Search = connect(
	(state) => ({
		results: state.searchResults,
	}),
	(dispatch) => ({
		search: query => dispatch(searchBooks(query)),
		reset: () => dispatch(resetSearch()),
	}),
)(comp);

import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import {connect} from 'react-redux';
import {Bookshelf} from './components/Bookshelf';
import {fetchBooks} from './actions';
import {Search} from './components/Search';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

class BooksApp extends React.Component {
	componentDidMount() {
		this.props.fetchBooks();
	}

	render() {
		const shelves = this.props.shelves.map(shelf => {
			return (
				<Bookshelf
					books={this.props.books.filter(book => book.shelf === shelf.id)}
					shelves={this.props.shelves}
					shelfId={shelf.id}
				/>
			)
		});

		return (
			<div className="app">
				<Router>
					<Route
						exact
						path="/"
						render={() => {
							return (
								<div className="list-books">
									<div className="list-books-title">
										<h1>MyReads</h1>
									</div>
									<div className="list-books-content">
										<div>
											{shelves}
										</div>
									</div>
									<div className="open-search">
										<Link to="/search">
											<button>Add a book</button>
										</Link>
									</div>
								</div>
							);
						}}
					/>
					<Route path="/search" component={Search}/>
				</Router>
			</div>
		)
	}
}

export default connect(
	state => ({
		books: state.books,
		shelves: state.shelves,
	}),
	dispatch => ({
		fetchBooks: () => dispatch(fetchBooks()),
	}),
)(BooksApp)

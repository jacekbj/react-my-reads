import { debounceTime, switchMap, map, withLatestFrom } from 'rxjs/operators'
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import * as Api from './BooksAPI';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

const FETCH_BOOKS = 'FETCH_BOOKS';
const FETCH_BOOKS_SUCCESS = 'FETCH_BOOKS_SUCCESS';
const SEARCH_BOOKS = 'SEARCH_BOOKS';
const SEARCH_BOOKS_SUCCESS = 'SEARCH_BOOKS_SUCCESS';
const RESET_SEARCH = 'RESET_SEARCH';
const UPDATE_BOOK = 'UPDATE_BOOK';

export const fetchBooks = () => ({ type: FETCH_BOOKS });
const fetchBooksSuccess = (books) => ({ type: FETCH_BOOKS_SUCCESS, books });

export const searchBooks = (query) => ({ type: SEARCH_BOOKS, query});
const searchBooksSuccess = (books) => ({ type: SEARCH_BOOKS_SUCCESS, books });

export const resetSearch = () => ({ type: RESET_SEARCH });

export const updateShelf = (bookId, shelf) => ({
	type: UPDATE_BOOK,
	bookId,
	shelf,
});

function updateBooksShelves(books, shelfToBookMapping) {
	Object.entries(shelfToBookMapping).forEach(([shelf, shelfBooks]) => {
		shelfBooks.forEach((shelfBookId) => {
			const book = books.find(book => book.id === shelfBookId);

			if (book) {
				book.shelf = shelf;
			}
		})
	});

	return books;
}

const fetchBooksEpic = action$ => action$.pipe(
	ofType(FETCH_BOOKS),
	switchMap(
		() => from(Api.getAll()).pipe(
			map(fetchBooksSuccess),
		),
	),
);

const searchBooksEpic = action$ => action$.pipe(
	ofType(SEARCH_BOOKS),
	debounceTime(500),
	switchMap(
		(action) => from(Api.search(action.query)).pipe(
			map(searchBooksSuccess),
		),
	),
);

const updateBookEpic = (action$, state$) => action$.pipe(
	ofType(UPDATE_BOOK),
	switchMap(
		(action) => from(Api.update({id: action.bookId}, action.shelf)).pipe(
			withLatestFrom(state$),
			map(([mapping, state]) => updateBooksShelves(state.books.slice(), mapping)),
			map(fetchBooksSuccess)
		)
	),
);

const rootEpic = combineEpics(
	fetchBooksEpic,
	searchBooksEpic,
	updateBookEpic,
);

const initialState = {
	books: [],
	shelves: [
		{
			id: 'currentlyReading',
			name: 'Currently Reading',
		},
		{
			id: 'read',
			name: 'Read',
		},
		{
			id: 'wantToRead',
			name: 'Want to read',
		}
	],
	searchResults: [],
};

const bookReducer = (state = [], action) => {
	switch (action.type) {
		case FETCH_BOOKS_SUCCESS:
			return action.books;
		default:
			return state;
	}
};

const searchReducer = (state = [], action) => {
	switch (action.type) {
		case SEARCH_BOOKS_SUCCESS:
			return action.books;
		case RESET_SEARCH:
			return [];
		default:
			return state;
	}
};

const shelfReducer = (state = []) => {
	return state;
};

const rootReducer = combineReducers({
	books: bookReducer,
	shelves: shelfReducer,
	searchResults: searchReducer,
});


export const configureStore = () => {
	const epicMiddleWare = createEpicMiddleware();
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(
		rootReducer,
		initialState,
		composeEnhancers(
			applyMiddleware(
				epicMiddleWare,
			),
		),
	);

	epicMiddleWare.run(rootEpic);

	return store;
};

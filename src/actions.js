import { switchMap, map } from 'rxjs/operators'
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import {getAll} from './BooksAPI';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

const FETCH_BOOKS = 'FETCH_BOOKS';
const FETCH_BOOKS_SUCCESS = 'FETCH_BOOKS_SUCCESS';

export const fetchBooks = () => ({ type: FETCH_BOOKS });
const fetchBooksSuccess = (books) => ({ type: FETCH_BOOKS_SUCCESS, books });

const fetchBooksEpic = action$ =>action$.pipe(
	ofType(FETCH_BOOKS),
	switchMap(
		() => from(getAll()).pipe(
			map(fetchBooksSuccess),
		)
	),
);

const rootEpic = combineEpics(
	fetchBooksEpic,
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
	]
};

const bookReducer = (state = [], action) => {
	switch (action.type) {
		case FETCH_BOOKS_SUCCESS:
			return action.books;
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

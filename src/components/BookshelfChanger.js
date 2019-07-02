import React from 'react';

export const BookshelfChanger = (props) => {
	const shelves = props.shelves.map(s => (
		<option key={s.id} value={s.id}>{s.name}</option>
	));
	return (
		<div className="book-shelf-changer">
			<select defaultValue={props.shelfId}>
				<option value="move" disabled>Move to...</option>
				{shelves}
			</select>
		</div>
	)
};

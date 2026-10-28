import { NavLink } from 'react-router-dom';
const Book = ({ id, title, description, createdAt }: { id: number, title: string, description: string, createdAt: Date}) => {
  return (
    <div>
      <h1>Book title: {title}</h1>
      <p>Description: {description}</p>
      <p>Created at: {createdAt.toString()}</p>
      <div>
        <p>Update book: </p>
        <NavLink to={`/books/update/${id}`}>Update</NavLink>
      </div>
    </div>
  );
}

export default Book;

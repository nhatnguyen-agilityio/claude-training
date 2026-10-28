import { useEffect, useState } from "react";
import Book from "../../components/Book";
import { NavLink } from "react-router-dom";


type Book = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
}

const Books = () => {
  const [listBooks, setListBooks] = useState<Book[]>([]);
  useEffect(() => {
    fetch("https://683417dd464b499636014699.mockapi.io/api/v1/books")
      .then((response) => response.json())
      .then((data) => {
        setListBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  return (
    <div className="books">
      {listBooks.map((book) => (
        <Book
          key={book.id}
          id={book.id}
          title={book.title}
          description={book.description}
          createdAt={book.createdAt}
        />
      ))}
      <p>Create a new book</p>
      <NavLink to="/books/create">Create a new book</NavLink>
    </div>
  );
}
export default Books;

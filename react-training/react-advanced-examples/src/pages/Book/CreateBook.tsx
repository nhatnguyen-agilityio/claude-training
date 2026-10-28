import{ useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") {
      setError('Title is required');
      return;
    }

    try {
      const response = await fetch('https://683417dd464b499636014699.mockapi.io/api/v1/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          authorId: author,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create book');
      }

      const data = await response.json();
      console.log('Book created:', data);
      setTitle('');
      setDescription('');
      setAuthor(1);
      setError('');
      navigate('/books'); // Redirect to the books list after creation
    }
    catch (error) {
      console.error('Error creating book:', error);
      setError('Failed to create book');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input type="text" name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        <select name="author" defaultValue="default" onChange={(e) => setAuthor(Number(e.target.value))}>
          <option value={author}>Author 1</option>
          <option value="2">Author 2</option>
          <option value="3">Author 3</option>
        </select>
        <button type="submit">Create Book</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </label>
    </form>
  );
}
export default CreateBook;

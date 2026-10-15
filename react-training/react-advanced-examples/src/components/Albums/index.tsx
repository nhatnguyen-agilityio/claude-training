const albums = [
  {
    id: 1,
    title: "Let It Be",
    year: 1970,
  },
  {
    id: 2,
    title: "Abbey Road",
    year: 1969,
  },
  {
    id: 3,
    title: "Yellow Submarine",
    year: 1968,
  },
  {
    id: 4,
    title: "The Beatles",
    year: 1967,
  },
  {
    id: 5,
    title: "Magical Mystery Tour",
    year: 1967,
  },
  {
    id: 6,
    title: "Sgt. Pepper's Lonely Hearts Club Band",
    year: 1967,
  },
  {
    id: 7,
    title: "Revolver",
    year: 1966,
  },
  {
    id: 8,
    title: "Rubber Soul",
    year: 1965,
  },
  {
    id: 8,
    title: "Help!",
    year: 1964,
  },
  {
    id: 9,
    title: "Beatles For Sale",
    year: 1964,
  },
  {
    id: 10,
    title: "A Hard Day's Night",
    year: 1964,
  },
  {
    id: 11,
    title: "With The Beatles",
    year: 1963,
  },
  {
    id: 12,
    title: "Please Please Me",
    year: 1963,
  },
]

const Albums = () => {
  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
};

export default Albums;

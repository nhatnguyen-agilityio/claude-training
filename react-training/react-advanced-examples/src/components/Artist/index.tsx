import { lazy, Suspense, useState } from "react";
import Loading from "../Loading";
import Biography from "../Biography";
import Panel from "../Panel";

const Albums = lazy(() => import("../Albums"));

const Artist = () => {
  const [showAlbums, setShowAlbums] = useState(false);

  return (
    <>
      <h1>Artist</h1>
      <button onClick={() => setShowAlbums(!showAlbums)}>
        {showAlbums ? "Hide Albums" : "Show Albums"}
      </button>
      {showAlbums && (
        <Suspense fallback={<Loading />}>
          <Biography />
          <Suspense fallback={<Loading />}>
            <Panel>
              <Albums />
            </Panel>
          </Suspense>
        </Suspense>
      )}
    </>
  );
};

export default Artist;

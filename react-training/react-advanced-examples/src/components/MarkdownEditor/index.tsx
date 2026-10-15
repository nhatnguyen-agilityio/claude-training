import { lazy, Suspense, useState } from "react";
import Loading from "../Loading";

const  MarkdownPreview = lazy(() => import("../MarkdownPreview"));

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("Hello");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <h1>Markdown Editor</h1>
      <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} />
      <br />
      <label>
        <input type="checkbox" name="markdown" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {
        showPreview && (
          <Suspense fallback={<Loading />}>
            <MarkdownPreview markdown={markdown} />
          </Suspense>
        )
      }
    </>
  );
};

export default MarkdownEditor;

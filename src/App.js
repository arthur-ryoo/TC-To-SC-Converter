import React, { useState } from 'react';
import { sify } from 'chinese-conv';
import './App.css';

function App() {
  const [fileParsingName, setFileParsingName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState();

  const translateGenerically = async (file) => {
    setFileParsingName(file.name);
    const text = await file.text();
    const translatedText = sify(text);
    const blob = new Blob([translatedText], {
      type: 'text/plain',
    });
    const downloadUrl = URL.createObjectURL(blob);
    setDownloadUrl(downloadUrl);
  };

  const getFileName = () => {
    const pieces = fileParsingName.split('.');
    if (!pieces.length) {
      return fileParsingName;
    }
    const extension = pieces[pieces.length - 1];
    const baseName = fileParsingName.slice(
      0,
      fileParsingName.length - extension.length
    );
    return `${baseName}${extension}`;
  };

  return (
    <div className="App">
      <div>
        <p>
          Select a local file on your computer by clicking the choose file
          button. You will then be provided with a download link with all the
          text in the file
        </p>
        <input
          type="file"
          multiple
          onChange={(event) => {
            if (!event.target.files || event.target.files.length === 0) {
              return;
            }
            translateGenerically(event.target.files[0]);
          }}
        />
        <div>
          {downloadUrl ? (
            <a href={downloadUrl} download={getFileName()}>
              {`Download Result - ${getFileName()}`}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { sify } from 'chinese-conv';
import './App.css';

function App() {
  const [fileParsingName, setFileParsingName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState();
  const [url2, setUrl2] = useState([]);
  let url = '';
  let name = '';
  const translateGenerically = async (file) => {
    setFileParsingName(file.name);
    const text = await file.text();
    const translatedText = sify(text);
    const blob = new Blob([translatedText], {
      type: 'text/plain',
    });
    const downloadUrl = URL.createObjectURL(blob);
    url = downloadUrl;
    name = file.name;
    setDownloadUrl(downloadUrl);
  };

  const getFileName = () => {
    const pieces = name.split('.');
    if (!pieces.length) {
      return name;
    }
    const extension = pieces[pieces.length - 1];
    const baseName = name.slice(0, name.length - extension.length);
    return `${baseName}${extension}`;
  };

  let links = [];

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleOnChange = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    let filesArray = [];
    for (let i = 0; i < event.target.files.length; i++) {
      filesArray.push(event.target.files[i]);
    }
    let num = 1;
    filesArray.forEach(async (item) => {
      await translateGenerically(item);

      if (url) {
        links.push(
          <div key={num}>
            {num}
            <a href={url} download={getFileName()}>
              {`Download Result - ${getFileName()}`}
            </a>
          </div>
        );
        num = num + 1;
      }
    });
    await timeout(1000);
    setUrl2(links);
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
          onChange={(event) => handleOnChange(event)}
        />
        <div>
          {url2}
          {/* {downloadUrl ? (
            <a href={downloadUrl} download={getFileName()}>
              {`Download Result - ${getFileName()}`}
            </a>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}

export default App;

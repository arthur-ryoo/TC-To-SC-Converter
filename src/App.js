import React, { useState, useEffect } from "react";
import { sify } from "chinese-conv";
import "./App.css";

function App() {
  const [fileParsingName, setFileParsingName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState();
  const [linkArray, setLinkArray] = useState([]);

  useEffect(() => {
    if (downloadUrl)
      setLinkArray(linkArray.concat(
        <div>
          <a href={downloadUrl} download={getFileName()}>
            {`Download Result - ${getFileName()}`}
          </a>
        </div>
      )
      )
  }, [downloadUrl]);

  const translateGenerically = async file => {

    const text = await file.text();
    const translatedText = sify(text);
    const blob = new Blob([translatedText], {
      type: "text/plain"
    });
    const downloadUrl = URL.createObjectURL(blob);
    setFileParsingName(file.name);
    setDownloadUrl(downloadUrl);

  };

  const getFileName = () => {
    const pieces = fileParsingName.split(".");
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


  const handleOnChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    let filesArray = [];
    for (let i = 0; i < event.target.files.length; i++) {
      filesArray.push(event.target.files[i]);
    }

    filesArray.forEach(async (item) => {
      await translateGenerically(item);
    })
  }


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
          onChange={(event) => handleOnChange(event)}
          multiple
        />
        <div>
          {linkArray}
        </div>
      </div>
    </div>
  );
}

export default App;

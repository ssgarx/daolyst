import React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

function DescEditor({ setDaoDescription, daoDescription }) {
  const handleChange = (e) => {
    console.log("e", e);
    setDaoDescription(e);
  };

  return (
    <SunEditor
      onChange={handleChange}
      previewTemplate={false}
      height="200px"
      placeholder="Add description here..."
      setDefaultStyle="font-family: Roboto, sans-serif; font-size: 15px; border: none; background-color: #ececec"
      // hideToolbar={true}
      resizingBar={false}
      showPathLabel={false}
      defaultResizingBar={true}
      setContents={daoDescription ?? ""}
      setOptions={{
        buttonList: [["bold", "underline", "italic", "link", "list"]],
      }}
    />
  );
}

export default DescEditor;

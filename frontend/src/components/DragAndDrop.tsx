import { useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface DropzoneProps {
  accept: Accept;
  handleFileDragAndDrop: (acceptedFiles: File[]) => void;
}

const Dropzone = ({ accept, handleFileDragAndDrop }: DropzoneProps) => {
  const onDrop = useCallback((files: File[]) => {
    handleFileDragAndDrop(files);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: 3,
        margin: 2,
      }}
    >
      <Typography variant="h6">Drag and drop files here</Typography>
      <div
        {...getRootProps()}
        style={{
          borderColor: "gray",
          borderWidth: 2,
          borderStyle: "dashed",
          marginTop: 5,
          padding: 3,
          width: "100%",
          minHeight: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here ...</Typography>
        ) : (
          <Typography>Or click here to select files</Typography>
        )}
      </div>
    </Paper>
  );
};

export default Dropzone;

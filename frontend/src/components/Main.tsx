import { useEffect, useState } from "react";
import Dropzone from "./DragAndDrop";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserFiles, uploadFile } from "../api/files";
import FilesList from "./FilesList";
import { DataGrid } from "@mui/x-data-grid";

const Main = () => {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<unknown[]>([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["files"],
    queryFn: fetchUserFiles,
    retry: 2,
  });

  const handleFileDragAndDrop = (files: File[]) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("name", files[0].name);
    uploadFile(formData)
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ["files"] });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (data) {
      setFiles([...data]);
    }
  }, [data, isLoading, isError]);
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      {/* file input (drag and drop) */}
      <Dropzone
        accept={{
          "text/csv": [".csv"],
        }}
        handleFileDragAndDrop={handleFileDragAndDrop}
      />

      {/* list of user files */}
      <FilesList files={files} />
    </div>
  );
};

export default Main;

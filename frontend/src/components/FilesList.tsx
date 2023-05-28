import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  CloudUpload,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { deleteFile, downloadFile } from "../api/files";
import { useQueryClient } from "@tanstack/react-query";
import { getLoadedFileData } from "../api/etl";
import { useContext } from "react";
import { ETLContext } from "../context/context";
import { useNavigate } from "react-router-dom";

function FilesList({ files }: { files: any }) {
  const queryClient = useQueryClient();
  const { setCurrentlyLoadedFile } = useContext(ETLContext)!;
  const navigate = useNavigate();

  const handleDownloadFile = (id: number) => {
    downloadFile(id).then((res) => {
      const downloadUrl = window.URL.createObjectURL(res);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.setAttribute("download", "file.csv"); //any other extension

      document.body.appendChild(link);

      link.click();

      link.remove();
    });
  };

  const handleDeleteFile = (id: number) => {
    deleteFile(id)
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ["files"] });
        toast.success("Deleted");
      })
      .catch((err) => toast.error("Error while deleting"));
  };

  const handleLoadFileOnDataGrid = (id: number) => {
    getLoadedFileData(id)
      .then((res) => {
        setCurrentlyLoadedFile(JSON.parse(res));
        setTimeout(() => {
          navigate("etl", {state: {
            file_id: id
          }});
        }, 1000);
      })
      .catch((err) => {
        toast.error("Error while loading file content");
      });
  };
  return (
    <List
      sx={{
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      <Typography fontSize={20} fontWeight={600}>
        Files list
      </Typography>
      {files.map((file: any) => (
        <ListItem
          sx={{
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          }}
          key={file.id}
        >
          <ListItemText primary={file.name + file.id} />
          <ListItemSecondaryAction>
            <Tooltip title="Load">
              <IconButton
                onClick={() => handleLoadFileOnDataGrid(file.id)}
                aria-label="Load"
              >
                <CloudUpload color="info" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton
                onClick={() => handleDownloadFile(file.id)}
                aria-label="Download"
              >
                <DownloadIcon color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeleteFile(file.id)}
                aria-label="Delete"
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default FilesList;

import { DataGrid } from "@mui/x-data-grid";
import { DragEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { ETLContext } from "../context/context";
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  apply_transformation,
  delete_transformation,
  eval_transformation,
  getAllUserTransformations,
  save_transformation,
} from "../api/etl";
import { toast } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ETL = () => {
  // generate all transformations
  const { data } = useQuery({
    queryKey: ["transformations"],
    queryFn: getAllUserTransformations,
    retry: 2,
  });
  const queryClient = useQueryClient();
  const location = useLocation();
  const { currentlyLoadedFile, setCurrentlyLoadedFile } =
    useContext(ETLContext)!;
  const navigate = useNavigate();
  const [additionValue, setAdditionValue] = useState("");
  const [multiplicationnValue, setMultiplicationValue] = useState("");
  const [substractionValue, setSubstractionValue] = useState("");
  const [divisionValue, setDivisionValue] = useState("");
  const [operation, setOperation] = useState("");

  const handleSaveTransformation = () => {
    if (!operation) {
      return toast.error("fill operation input");
    }
    save_transformation(operation)
      .then((res) => {
        toast.success("Success");
        setOperation("");
        queryClient.invalidateQueries({ queryKey: ["transformations"] });
      })
      .catch((err) => {
        console.log("error");
      });
  };

  const handleDeleteTransformation = (id: number) => {
    delete_transformation(id)
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ["transformations"] });
      })
      .catch((err) => {
        toast.error("Error occured");
      });
  };

  const handleSimpleOperation = (
    e: DragEvent<HTMLDivElement>,
    column_name: string
  ) => {
    const value = e.dataTransfer.getData("Text");
    const operator = e.dataTransfer.getData("Operator");
    try {
      apply_transformation(
        location.state.file_id,
        operator as "*" | "+" | "-" | "/",
        eval(value),
        column_name
      )
        .then((res) => {
          console.log(JSON.parse(res));
          setCurrentlyLoadedFile(JSON.parse(res));
        })
        .catch((err) => toast.error("Error occured"));
    } catch {
      toast.error("Invalid operation");
    }
  };

  const handleComplexOperation = (
    e: MouseEvent<HTMLButtonElement>,
    check_operation_empty?: boolean,
    button_val?: string
  ) => {
    if (check_operation_empty === undefined) check_operation_empty = true;

    try {
      if (check_operation_empty && !operation) {
        return toast.error("fill operation input");
      }
      eval_transformation(
        location.state.file_id,
        !check_operation_empty ? button_val! : operation
      )
        .then((res) => {
          console.log(JSON.parse(res));
          setCurrentlyLoadedFile(JSON.parse(res));
        })
        .catch((err) => toast.error("Error occured"));
    } catch {
      toast.error("Invalid operation");
    }
  };

  useEffect(() => {
    if (!currentlyLoadedFile?.length) {
      navigate("/");
    }
  }, [currentlyLoadedFile]);

  return (
    currentlyLoadedFile?.length !== 0 && (
      <>
        <Button
          variant="contained"
          sx={{
            mx: 4,
            marginBottom: 2,
          }}
        >
          <Link to="/">
            <ArrowBackIcon htmlColor="white" />
          </Link>
        </Button>
        <Typography mx={4} fontWeight={700}>
          Transformation list{" "}
          <span
            style={{
              fontWeight: 500,
            }}
          >
            (fill input and drag/drop)
          </span>
        </Typography>
        <Stack my={2} mx={7} direction="row" spacing={1}>
          <Input
            onDragStart={(e) => {
              e.dataTransfer.dropEffect = "move";
              if (!additionValue) e.preventDefault();
              e.dataTransfer.setData("Text", additionValue);
              e.dataTransfer.setData("Operator", "+");
            }}
            onChange={(e) => {
              setAdditionValue(e.target.value);
            }}
            value={additionValue}
            draggable
            sx={{
              padding: "4px",
            }}
            startAdornment={
              <InputAdornment
                sx={{
                  fontSize: "20px",
                }}
                position="start"
              >
                <AddIcon />
              </InputAdornment>
            }
            placeholder="Addition"
          />
          <Input
            onDragStart={(e) => {
              e.dataTransfer.dropEffect = "move";
              if (!substractionValue) e.preventDefault();
              e.dataTransfer.setData("Text", substractionValue);
              e.dataTransfer.setData("Operator", "-");
            }}
            onChange={(e) => {
              setSubstractionValue(e.target.value);
            }}
            value={substractionValue}
            draggable
            sx={{
              padding: "4px",
            }}
            startAdornment={
              <InputAdornment
                sx={{
                  fontSize: "20px",
                }}
                position="start"
              >
                <RemoveIcon />
              </InputAdornment>
            }
            placeholder="Substruction"
          />
          <Input
            onDragStart={(e) => {
              e.dataTransfer.dropEffect = "move";
              if (!multiplicationnValue) e.preventDefault();
              e.dataTransfer.setData("Text", multiplicationnValue);
              e.dataTransfer.setData("Operator", "*");
            }}
            onChange={(e) => {
              setMultiplicationValue(e.target.value);
            }}
            value={multiplicationnValue}
            draggable
            sx={{
              padding: "4px",
            }}
            startAdornment={
              <InputAdornment
                sx={{
                  fontSize: "20px",
                }}
                position="start"
              >
                <CloseIcon />
              </InputAdornment>
            }
            placeholder="Multiplication"
          />
          <Input
            onDragStart={(e) => {
              e.dataTransfer.dropEffect = "move";
              if (!divisionValue) e.preventDefault();
              e.dataTransfer.setData("Text", divisionValue);
              e.dataTransfer.setData("Operator", "/");
            }}
            onChange={(e) => {
              setDivisionValue(e.target.value);
            }}
            value={divisionValue}
            draggable
            sx={{
              padding: "4px",
            }}
            startAdornment={
              <InputAdornment
                sx={{
                  fontSize: "20px",
                }}
                position="start"
              >
                /
              </InputAdornment>
            }
            placeholder="Division"
          />
        </Stack>

        <Typography mx={4} fontWeight={700}>
          Custom user transformation
        </Typography>
        <Box sx={{ display: "flex" }} mx={4} alignItems="center" gap={2}>
          <TextField
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            label="Custom operation"
            type="text"
            variant="filled"
          />
          <Button onClick={handleComplexOperation} variant="contained">
            Apply
          </Button>
          <Button onClick={handleSaveTransformation} variant="contained">
            Save
          </Button>
        </Box>

        <Typography my={2} mx={4} fontWeight={700}>
          Saved transformations
        </Typography>
        <Stack my={2} mx={7} direction="row" spacing={1}>
          {data?.length ? (
            data.map((el: any) => (
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Tooltip title="apply trans">
                  <Button
                    onClick={(e) =>
                      handleComplexOperation(e, false, el.transformation_code)
                    }
                    sx={{
                      ":hover": {
                        backgroundColor: "#f0f0f0 ",
                      },
                    }}
                    variant="outlined"
                  >
                    {el.transformation_code}
                  </Button>
                </Tooltip>
                <Tooltip title="delete trans">
                  <Button
                    onClick={() => handleDeleteTransformation(el.id)}
                    variant="contained"
                    color="error"
                  >
                    delete
                  </Button>
                </Tooltip>
              </ButtonGroup>
            ))
          ) : (
            <em
              style={{
                fontWeight: 300,
                color: "#a8a8a8",
              }}
            >
              no transformations yet{" "}
            </em>
          )}
        </Stack>
        <Box
          sx={{
            margin: "0 20px",
            maxHeight: "80vh",
          }}
        >
          <Typography mx={2} fontWeight={700}>
            Data
          </Typography>
          <DataGrid
            columns={Object.keys(currentlyLoadedFile[0]).map((el) => ({
              field: el,
              flex: 1,
              renderCell: (params) => (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeContent: "center",
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => handleSimpleOperation(e, el)}
                >
                  {params.value}
                </div>
              ),
            }))}
            rows={currentlyLoadedFile.map((el: any, index: number) => ({
              id: index,
              ...el,
            }))}
          />
        </Box>
      </>
    )
  );
};

export default ETL;

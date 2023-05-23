import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";

const PeripheralFormDialog = ({
  isOpen,
  peripheral,
  onSubmit,
  onClose,
  fetchData,
}) => {
  const [state, setState] = React.useState({
    uid: peripheral?.uid || "",
    vendor: peripheral?.vendor || "",
    status: peripheral?.status || "",
    dateCreated: peripheral?.dateCreated || "",
  });

  const resetForm = () => {
    setState({
      uid: "",
      vendor: "",
      status: "",
      dateCreated: "",
    });
  };

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(state);
    fetchData();
    resetForm();
    onClose();
  };

  React.useEffect(() => {
    setState({
      uid: peripheral?.uid || "",
      vendor: peripheral?.vendor || "",
      status: peripheral?.status || "",
      dateCreated: peripheral?.dateCreated || "",
    });
  }, [peripheral]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullScreen>
      <DialogTitle>
        {peripheral ? "Edit Peripheral" : "Create Peripheral"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          <TextField
            label="UID"
            name="uid"
            value={state.uid}
            onChange={handleChange}
            required
          />
          <TextField
            label="Vendor"
            name="vendor"
            value={state.vendor}
            onChange={handleChange}
            required
          />
          <TextField
            label="Status"
            name="status"
            value={state.status}
            onChange={handleChange}
            required
          />

          <TextField
            label="Creation date"
            name="dateCreated"
            type="datetime-local"
            value={state.dateCreated}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button onClick={onClose}>Close</Button>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PeripheralFormDialog;

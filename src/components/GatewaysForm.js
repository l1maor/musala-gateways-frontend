import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from '@mui/material';

import Multiselect from './Multiselect'

const GatewayFormDialog = ({ isOpen, gateway, peripherals, onSubmit, onClose, fetchData }) => {
  const [state, setState] = React.useState({
    serialNumber: gateway?.serialNumber || '',
    name: gateway?.name || '',
    ipv4: gateway?.ipv4 || '',
    peripherals: gateway?.peripherals || [],
  });

  const resetForm = () => {
    setState({
      serialNumber: '',
      name: '',
      ipv4: '',
      peripherals: [],
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
      serialNumber: gateway?.serialNumber || '',
      name: gateway?.name || '',
      ipv4: gateway?.ipv4 || '',
      peripherals: gateway?.peripherals || [],
    });
  }, [gateway]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullScreen>
      <DialogTitle>{gateway ? 'Edit Gateway' : 'Create Gateway'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          <TextField
            label="Serial Number"
            name="serialNumber"
            value={state.serialNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Name"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="IPv4"
            name="ipv4"
            value={state.ipv4}
            onChange={handleChange}
            required
          />

            <Multiselect peripherals={peripherals} prevSelection={gateway?.peripherals || []} onSelectUpdate={(newSelection) => {
              console.log("🚀 ~ file: GatewayFormDialog.js:171 ~ onSelectUpdate ~ state.peripherals", state.peripherals)
              setState((prevState) => ({
                ...prevState,
                peripherals: newSelection.map((s) => s.value),
              }));
            }} />

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

export default GatewayFormDialog

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  IconButton,
} from "@mui/material";

import GatewaysForm from "./GatewaysForm";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const GatewaysTable = ({ gateways, peripherals, fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("serialNumber");
  const [editingGateway, setEditingGateway] = useState(null);
  const [gatewayFormOpen, setGatewayFormOpen] = React.useState(false);

  const handleCreateNewClick = () => {
    setEditingGateway(null);
    setGatewayFormOpen(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleCreateGateway = async (gateway) => {
    try {
      await axios.post("http://localhost:5000/api/gateway", gateway);
    } catch (err) {
      console.error(err);
    }
    // todo validations
    setEditingGateway(null);
  };

  const handleDeleteGatewayClick = async ({ serialNumber }) => {
    try {
      await axios.delete(`http://localhost:5000/api/gateway/${serialNumber}`);
    } catch (err) {
      console.error(err);
    }
    setEditingGateway(null);
    fetchData();
  };

  const handleUpdateGateway = async (gateway) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/gateway/${gateway.serialNumber}`,
        gateway
      );
    } catch (err) {
      console.error(err);
    }

    setEditingGateway(null);
    fetchData();
  };

  const handleEditGatewayClick = (gateway) => {
    setEditingGateway(gateway);
    setGatewayFormOpen(true);
  };

  return (
    <>
      <Button onClick={handleCreateNewClick}>New Gateway</Button>
      <GatewaysForm
        fetchData={fetchData}
        gateway={editingGateway}
        isOpen={gatewayFormOpen}
        onClose={() => {
          setGatewayFormOpen(false);
        }}
        peripherals={peripherals}
        onSubmit={!editingGateway ? handleCreateGateway : handleUpdateGateway}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "serialNumber"}
                direction={orderBy === "serialNumber" ? order : "asc"}
                onClick={createSortHandler("serialNumber")}
              >
                Serial Number
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={createSortHandler("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "ipv4"}
                direction={orderBy === "ipv4" ? order : "asc"}
                onClick={createSortHandler("ipv4")}
              >
                IPv4
              </TableSortLabel>
            </TableCell>
            <TableCell>Peripherals</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(gateways, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.serialNumber}>
                <TableCell>{row.serialNumber}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.ipv4}</TableCell>
                <TableCell>
                  {row.peripherals?.map((p) => p.uid).join(", ") || "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleEditGatewayClick(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleDeleteGatewayClick(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        component="div"
        count={gateways.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default GatewaysTable;

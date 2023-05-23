import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  Button,
} from "@mui/material";

import axios from 'axios';
import PeripheralsForm from "./PeripheralsForm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const PeripheralsTable = ({ peripherals, fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("uid");
  const [editingPeripheral, setEditingPeripheral] = useState(null);
  const [peripheralFormOpen, setPeripheralFormOpen] = React.useState(false);

  const handleCreateClick = () => {
    setEditingPeripheral(null)
    setPeripheralFormOpen(true);
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


  const handleCreatePeripheral = async (record) => {
    try {

      await axios.post(
        "http://localhost:5000/api/peripheral",
        record
      );
    } catch (err) {
      console.error(err)
    }
    setEditingPeripheral(null);
  };

  const handleDeletePeripheralClick = async ({ uid }) => {
    try {
      await axios.delete(
      `http://localhost:5000/api/peripheral/${uid}`
    );
  } catch (err) {
    console.error(err)
  }
    setEditingPeripheral(null);
    fetchData();
  };

  const handleUpdatePeripheral = async (record) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/peripheral/${record.uid}`,
        record
      );
    } catch (err) {
      console.error(err)
    }
    setEditingPeripheral(null);
    fetchData();
  };

  const handleEditPeripheralClick = (record) => {
    setEditingPeripheral(record);
    setPeripheralFormOpen(true);
  };

  return (
    <>
      <Button onClick={handleCreateClick}>New Peripheral</Button>
      <PeripheralsForm
        fetchData={fetchData}
        peripheral={editingPeripheral}
        isOpen={peripheralFormOpen}
        onClose={() => {
          setPeripheralFormOpen(false);
        }}
        peripherals={peripherals}
        onSubmit={!editingPeripheral ? handleCreatePeripheral : handleUpdatePeripheral}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "uid"}
                direction={orderBy === "uid" ? order : "asc"}
                onClick={createSortHandler("uid")}
              >
                UID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "vendor"}
                direction={orderBy === "vendor" ? order : "asc"}
                onClick={createSortHandler("vendor")}
              >
                Vendor
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "status"}
                direction={orderBy === "status" ? order : "asc"}
                onClick={createSortHandler("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "dateCreated"}
                direction={orderBy === "dateCreated" ? order : "asc"}
                onClick={createSortHandler("dateCreated")}
              >
                Date created
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {stableSort(peripherals, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.uid}</TableCell>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.dateCreated}</TableCell>
                <TableCell>
                <IconButton onClick={() => handleEditPeripheralClick(row)}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </IconButton>
                  <IconButton onClick={() => { handleDeletePeripheralClick(row) }}>
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
        count={peripherals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default PeripheralsTable;

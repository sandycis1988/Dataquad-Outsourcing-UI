import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
} from "@mui/material";

const ReusableTable = ({
  data = [],
  headers = [],
  rowsPerPageOptions = [5, 10, 25],
  rowsPerPage,
  page,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onCellRender,
  tableStyle,
  hoverEffect = true,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "500px",
        overflowY: "auto",
        border: "1px solid #ddd",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        ...tableStyle,
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#4db6ac" }}>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  textTransform: "capitalize",
                  border: "1px solid #ddd",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  "&:hover": hoverEffect && { backgroundColor: "#dcedc8" },
                }}
              >
                {headers.map((header, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    sx={{
                      border: "1px solid #ddd",
                    }}
                  >
                    {onCellRender ? onCellRender(row, header) : row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ marginTop: 2 }}
      />
    </TableContainer>
  );
};

export default ReusableTable;

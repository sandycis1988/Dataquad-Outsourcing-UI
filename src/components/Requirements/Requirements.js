import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import JobForm from "./JobForm";
import axios from "axios";

const Requirements = () => {
  const [requirementsList, setRequirementsList] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    technology: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [fullDescription, setFullDescription] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");

  useEffect(() => {
    axios
      .get("http://192.168.0.124:9998/requirements/get")
      .then((response) => setRequirementsList(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const tableHeaders =
    requirementsList.length > 0 ? Object.keys(requirementsList[0]) : [];

  const filteredData = requirementsList.filter((req) => {
    return (
      (filters.name === "" ||
        req.jobTitle.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.location === "" ||
        req.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.technology === "" ||
        req.jobMode.toLowerCase().includes(filters.technology.toLowerCase()))
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (description, jobTitle) => {
    setFullDescription(description);
    setCurrentJobTitle(jobTitle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box sx={{ padding: { xs: 2, sm: 3 } }} >
      {/* Job Form Section */}
      <JobForm />

      {/* Table Section */}
      <Box
      
        sx={{
          backgroundColor: "#ffffff",
          padding: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          marginTop: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: 3,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            fontWeight: 600,
            color: "#3f51b5",
          }}
        >
          Requirements List
        </Typography>

        {/* Filter Inputs */}
        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          {[
            { label: "Filter by Name", name: "name" },
            { label: "Filter by Location", name: "location" },
            { label: "Filter by Technology", name: "technology" },
          ].map((filter, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <TextField
                fullWidth
                variant="outlined"
                label={filter.label}
                name={filter.name}
                value={filters[filter.name]}
                onChange={handleFilterChange}
              />
            </Grid>
          ))}
        </Grid>

        {/* Responsive Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "500px", // Set max height for the table
            overflowY: "auto", // Enable vertical scrolling
            border: "1px solid #ddd", // Optional: Add a border for styling
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Optional: Add subtle shadow
          }}
        >
          <Table  sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#4db6ac" }}>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      textTransform: "capitalize",
                      border: "1px solid #ddd", // Add border to TableCell
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((req, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#dcedc8",
                      },
                    }}
                  >
                    {tableHeaders.map((header, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          border: "1px solid #ddd", // Add border to each TableCell
                        }}
                      >
                        {header === "jobDescription" ? (
                          <>
                            {req[header].length > 20 ? (
                              <>
                                {req[header].slice(0, 20)}...
                                <Button
                                  variant="text"
                                  onClick={() =>
                                    handleOpenDialog(req[header], req.jobTitle)
                                  }
                                >
                                  View More
                                </Button>
                              </>
                            ) : (
                              req[header]
                            )}
                          </>
                        ) : (
                          req[header]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeaders.length} align="center">
                    No matching requirements found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginTop: 2 }}
        />
      </Box>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", textAlign: "center" }}
          >
            {currentJobTitle}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            style={{
              marginTop: "10px",
              color: "#555",
              lineHeight: "1.6",
              textAlign: "justify",
            }}
          >
            {fullDescription}
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", marginTop: "10px" }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            style={{
              padding: "8px 20px",
              borderRadius: "5px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Requirements;

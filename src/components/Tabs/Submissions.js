import React, { useState, useEffect } from "react";
import ReusableTable from "../ReusableTable";
import axios from "axios";
// import BASE_URL from "../../redux/apiConfig";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InterviewForm from "../InterviewForm";

const Submissions = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const userId = user;

  console.log("user id ----------djsnizhnd -----", userId);

  useEffect(() => {
    if (!userId) return;

    const fetchSubmissionData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.246:8082/candidate/submissions/${userId}`
        );

        console.log("user data from api ----", response.data);
        const userData = response.data || [];

        setTotalCount(userData.length || 0);

        const updatedData = userData.map((item) => ({
          ...item,
          Interview: "schedule-Interview",
        }));
        setData(updatedData);

        if (updatedData.length > 0) {
          const dynamicHeaders = Object.keys(updatedData[0]);
          setHeaders(dynamicHeaders);
        }
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchSubmissionData();
  }, [userId, page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenInterviewDialog = (candidate) => {
    console.log("Selected Candidate:", candidate);
    setSelectedCandidate(candidate);
    setOpenInterviewDialog(true);
  };

  const handleCloseInterviewDialog = () => {
    setOpenInterviewDialog(false);
    setSelectedCandidate(null);
  };

  const onCellRender = (row, header) => {
    if (header === "Interview") {
      return (
        <Link
          to="#"
          onClick={() => handleOpenInterviewDialog(row)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {row[header]}
        </Link>
      );
    }
    return row[header];
  };

  if (!userId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ReusableTable
        data={data}
        headers={headers}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onCellRender={onCellRender}
      />

      {/* Dialog for the candidate interview */}
      <Dialog
        open={openInterviewDialog}
        onClose={handleCloseInterviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h5"
            align="start"
            color="primary"
            gutterBottom
            sx={{
              backgroundColor: "rgba(232, 245, 233)",
              padding: 1,
              borderRadius: 1,
            }}
          >
            Schedule Interview
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseInterviewDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "primary",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <InterviewForm
            jobId={selectedCandidate?.jobId}
            candidateId={selectedCandidate?.candidateId}
            candidateFullName={selectedCandidate?.fullName}
            candidateContactNo={selectedCandidate?.contactNumber}
            clientName={selectedCandidate?.currentOrganization}
            userId={selectedCandidate?.userId}
            handleCloseInterviewDialog={handleCloseInterviewDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Submissions;

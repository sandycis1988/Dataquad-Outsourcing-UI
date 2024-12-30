import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableTable from "../ReusableTable";
import { useSelector } from "react-redux";
import { CircularProgress, Box, Typography } from "@mui/material";
import BASE_URL from "../../redux/apiConfig";

const Interview = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const userId = user;

  useEffect(() => {
    if (!userId) return;

    const fetchInterviewDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/candidate/interviews/${userId}`
        );
        const interviewData = response.data || [];
        setTotalCount(interviewData.totalCount || interviewData.length || 0);
        console.log('interview data : ', interviewData);
        

        setData(interviewData);

        if (interviewData.length > 0) {
          const dynamicHeaders = Object.keys(interviewData[0]);
          setHeaders(dynamicHeaders);
        }
      } catch (err) {
        console.error("Failed to fetch interview details", err);
      }
    };

    fetchInterviewDetails();
  }, [userId, page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onCellRender = (row, header) => {
    if (header === "interviewDate") {
      return new Date(row[header]).toLocaleString(); // Format date
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
    </>
  );
};

export default Interview;

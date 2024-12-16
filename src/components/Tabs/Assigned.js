import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableTable from "../ReusableTable"; // Ensure ReusableTable is correctly imported
import { useSelector } from "react-redux";

const Assigned = () => {
  const [data, setData] = useState([]); // State for table data
  const [headers, setHeaders] = useState([]); // Dynamic headers
  const [page, setPage] = useState(0); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [totalCount, setTotalCount] = useState(0); // Total count for pagination
  const { user } = useSelector((state) => state.auth); // Get logged-in user details from Redux

  const userId = user; // Assuming 'user' holds the userId

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    if (!userId) return; // Don't proceed if userId is not available

    const fetchUserSpecificData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.162:8111/requirements/recruiter/${userId}`
        );
        console.log("API response:", response.data); // Debug log

        const userData = response.data || []; // Ensure fallback to empty array
        setData(userData);
        setTotalCount(response.data.totalCount || userData.length || 0); // Handle missing totalCount with fallback

        // Dynamically generate headers from the data keys
        if (userData.length > 0) {
          const dynamicHeaders = Object.keys(userData[0]);
          setHeaders(dynamicHeaders);
        }
      } catch (err) {
        console.error("Failed to fetch user-specific data", err);
      }
    };

    fetchUserSpecificData();
  }, [userId, page, rowsPerPage]);

  // Handle page change in pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change in pagination
  const handleRowsPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Custom cell rendering logic for the table
  const onCellRender = (row, header) => {
    if (header === "jobDescription") {
      return row[header].slice(0, 50) + "..."; // Truncate long descriptions
    }
    if (header === "requirementAddedTimeStamp") {
      // Format the timestamp to a readable date
      return new Date(row[header]).toLocaleString();
    }
    return row[header];
  };

  // Show loading if userId is not available yet
  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <ReusableTable
      data={data} // The data to display in the table
      headers={headers} // Dynamically generated headers
      page={page} // Current page number
      rowsPerPage={rowsPerPage} // Rows per page
      totalCount={totalCount} // Total number of entries
      onPageChange={handlePageChange} // Pagination handler
      onRowsPerPageChange={handleRowsPerPageChange} // Rows per page handler
      onCellRender={onCellRender} // Custom cell rendering
    />
  );
};

export default Assigned;

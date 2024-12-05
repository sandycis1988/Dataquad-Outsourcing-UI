import React, { useState } from "react";
import ReusableTable from "../ReusableTable";

const Planned = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Example data for Planned Table
  const requirementsList = [
    { id: 1, task: "Interview Scheduling", owner: "Admin", deadline: "2024-12-10", priority: "High" },
    { id: 2, task: "Profile Sourcing", owner: "John Doe", deadline: "2024-12-15", priority: "Medium" },
    { id: 3, task: "Feedback Collection", owner: "Jane Smith", deadline: "2024-12-05", priority: "Low" },
  ];

  // Dynamically calculate table headers
  const tableHeaders = requirementsList.length > 0 ? Object.keys(requirementsList[0]) : [];

  return (
    <ReusableTable
      data={requirementsList}
      headers={tableHeaders}
      rowsPerPage={rowsPerPage}
      page={page}
      totalCount={requirementsList.length}
      onPageChange={(event, newPage) => setPage(newPage)}
      onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      onCellRender={(row, header) => {
        // Custom rendering for specific columns
        if (header === "deadline") {
          const isOverdue = new Date(row[header]) < new Date();
          return (
            <span style={{ color: isOverdue ? "red" : "blue", fontWeight: "bold" }}>
              {row[header]}
            </span>
          );
        }

        if (header === "priority") {
          const priorityColors = {
            High: "red",
            Medium: "orange",
            Low: "green",
          };
          return (
            <span style={{ color: priorityColors[row[header]], fontWeight: "bold" }}>
              {row[header]}
            </span>
          );
        }

        // Default rendering
        return row[header];
      }}
    />
  );
};

export default Planned;

import React, { useState } from "react";
import ReusableTable from "../ReusableTable";

const Assigned = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Example data for Assigned Table
  const requirementsList = [
    { id: 1, employee: "Mark Lee", task: "Resume Review", status: "In Progress", due_date: "2024-12-08" },
    { id: 2, employee: "Emma Watson", task: "Profile Search", status: "Completed", due_date: "2024-12-05" },
    { id: 3, employee: "John Doe", task: "Task Allocation", status: "Pending", due_date: "2024-12-15" },
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
        if (header === "status") {
          return (
            <span
              style={{
                color:
                  row[header] === "Completed"
                    ? "green"
                    : row[header] === "In Progress"
                    ? "orange"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {row[header]}
            </span>
          );
        }

        if (header === "due_date") {
          const isOverdue = new Date(row[header]) < new Date();
          return (
            <span style={{ color: isOverdue ? "red" : "blue", fontStyle: "italic" }}>
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

export default Assigned;

import React, { useState } from "react";
import ReusableTable from "../ReusableTable";

const Planned = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Example data for Planned
  const requirementsList = [
    { id: 1, task: "Interview Scheduling", owner: "Admin", deadline: "2024-12-10" },
    { id: 2, task: "Profile Sourcing", owner: "John Doe", deadline: "2024-12-15" },
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
        if (header === "deadline") {
          return (
            <span
              style={{
                color: new Date(row[header]) < new Date() ? "red" : "blue",
              }}
            >
              {row[header]}
            </span>
          );
        }
        return row[header];
      }}
    />
  );
};

export default Planned;

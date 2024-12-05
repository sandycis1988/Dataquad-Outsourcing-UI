import React, { useState } from "react";
import ReusableTable from "../ReusableTable";

const Submissions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Example data for Submissions
  const requirementsList = [
    { id: 1, candidate: "Alice Johnson", job: "Frontend Developer", status: "Submitted" },
    { id: 2, candidate: "Bob Smith", job: "Backend Developer", status: "Pending" },
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
      onCellRender={(row, header) =>
        header === "status" ? (
          <span
            style={{
              color: row[header] === "Submitted" ? "green" : "orange",
              fontWeight: "bold",
            }}
          >
            {row[header]}
          </span>
        ) : (
          row[header]
        )
      }
    />
  );
};

export default Submissions;

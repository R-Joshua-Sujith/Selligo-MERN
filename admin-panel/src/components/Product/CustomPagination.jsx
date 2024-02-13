import React, { useState } from "react";

const CustomPagination = ({ totalRows, pageSize, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalRows / pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="custom-pagination">
      <ul>{renderPageNumbers()}</ul>
    </div>
  );
};

export default CustomPagination;

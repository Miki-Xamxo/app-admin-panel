import React from 'react';

import { Table, TableContainer, Paper } from '@material-ui/core';

const TableBlock = ({ children }) => (
  <TableContainer component={Paper}>
    <Table>{children}</Table>
  </TableContainer>
);

export default TableBlock;

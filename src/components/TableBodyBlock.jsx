import React from 'react';
import { TableRow, TableBody } from '@material-ui/core';

const TableBodyBlock = ({ children, onClick }) => (
  <TableBody>
    <TableRow onClick={onClick} hover role="checkbox">
      {children}
    </TableRow>
  </TableBody>
);

export default TableBodyBlock;

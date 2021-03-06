import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const TableHeadBlock = ({ children }) => (
  <TableHead>
    <TableRow>{children}</TableRow>
  </TableHead>
);

export default TableHeadBlock;

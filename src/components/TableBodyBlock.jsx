import React from 'react';
import { TableRow, TableBody } from '@material-ui/core';
import { TransitionGroup } from 'react-transition-group';

const TableBodyBlock = ({ children, onClick }) => (
  // <TransitionGroup className="todo-list">
  <TableBody>
    <TableRow onClick={onClick} hover role="checkbox">
      {children}
    </TableRow>
  </TableBody>
  // </TransitionGroup>
);

export default TableBodyBlock;

import React from 'react';
import { Alert } from '@material-ui/lab';

const AlertMassege = ({ children, handleCloseMessage }) => (
  <Alert onClose={() => handleCloseMessage(false)} severity="error">
    {children}
  </Alert>
);

export default AlertMassege;

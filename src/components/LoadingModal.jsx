import React from 'react';

import { CircularProgress } from '@material-ui/core';

import AppContext from '../context';

const LoadingModal = () => {
  const { classes } = React.useContext(AppContext);

  return (
    <div className={classes.overlay}>
      <CircularProgress
        style={{
          width: 70,
          height: 70,
          position: 'absolute',
          zIndex: 1,
          opacity: 1,
        }}
      />
    </div>
  );
};

export default LoadingModal;

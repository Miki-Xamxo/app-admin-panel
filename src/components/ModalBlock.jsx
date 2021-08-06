import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const ModalBlock = ({ title, children, visible, onClose }) => (
  <Dialog open={visible} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">
      {title}
      <IconButton onClick={onClose} color="primary" aria-label="close">
        <CloseIcon style={{ fontSize: 26 }} color="secondary" />
      </IconButton>
    </DialogTitle>
    <DialogContent>{children}</DialogContent>
  </Dialog>
);

export default ModalBlock;

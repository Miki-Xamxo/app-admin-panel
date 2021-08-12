import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const ModalImage = ({ children, visible, onClose }) => (
  <Dialog open={visible} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogContent>{children}</DialogContent>
  </Dialog>
);

export default ModalImage;

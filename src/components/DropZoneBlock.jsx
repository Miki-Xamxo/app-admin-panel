/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Paper } from '@material-ui/core';
import Dropzone from 'react-dropzone';

import CloudUpload from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/Clear';

const DropZoneBlock = React.memo(
  ({
    classes,
    values,
    setFieldValue,
    preview,
    placeholder,
    selectedDropzone,
    accept,
    children,
    setPreview,
  }) => {
    const handleClearDropzone = (event) => {
      event.stopPropagation();
      setFieldValue(selectedDropzone, '');
      setPreview('');
    };

    return (
      <Dropzone
        accept={accept}
        onDrop={(acceptedFiles) => {
          const reader = new FileReader();

          reader.readAsDataURL(acceptedFiles[0]);

          reader.onloadend = () => {
            setPreview(reader.result);
          };

          setFieldValue(selectedDropzone, acceptedFiles[0]);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <>
            <Paper
              className={classes.dropzone}
              variant="outlined"
              {...getRootProps()}
            >
              {!values && !preview ? (
                <>
                  <CloudUpload className={classes.dropzoneIcon} />
                  <p>{`Щелкните или перетащите файл ${placeholder}`}</p>
                </>
              ) : (
                <>
                  <ClearIcon
                    style={{
                      position: 'absolute',
                      color: '#fff',
                      right: '10px',
                    }}
                    onClick={handleClearDropzone}
                  />
                  {children}
                </>
              )}
              <input {...getInputProps()} />
            </Paper>
          </>
        )}
      </Dropzone>
    );
  }
);

export default DropZoneBlock;

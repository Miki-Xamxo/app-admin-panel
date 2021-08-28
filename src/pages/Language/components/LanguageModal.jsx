import React from 'react';
import {
  Button,
  FormControl,
  TextField,
  ListItem,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import {
  AlertMassege,
  DropZoneBlock,
  LoadingModal,
  ModalBlock,
} from '../../../components';
import AppContext from '../../../context';

const LanguageModal = () => {
  const Schema = Yup.object().shape({
    name: Yup.string().required('Обязательное поле'),
  });

  const {
    classes,
    selectedModal,
    visibleLanguage,
    setVisibleLanguage,
    setSelectedModal,
    setLanguage,
  } = React.useContext(AppContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [isError, setIsError] = React.useState(false);

  if (!visibleLanguage) {
    return null;
  }

  const onClickCloseModal = () => {
    if (selectedModal) {
      setSelectedModal(null);
    }
    if (imagePreview) {
      setImagePreview(null);
    }
    if (isError) {
      setIsError(false);
    }
    setVisibleLanguage(false);
  };

  const onAddLanguage = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('active', values.active);
    if (values.image !== '') {
      formData.append('image', values.image);
    }
    if (values.position !== '') {
      formData.append('position', values.position);
    }

    try {
      setIsLoading(true);
      await axios.post('/languages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const respLanguage = await axios.get('/languages', {
        headers: {
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const sortLanguage = respLanguage.data.sort((a, b) =>
        a.position > b.position ? 1 : -1
      );

      setIsLoading(false);
      setLanguage(sortLanguage);
      onClickCloseModal();
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error(error);
    }
  };

  const onEditLanguage = async (values, selectedId) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('active', values.active);
    if (values.image !== '') {
      formData.append('image', values.image);
    }
    if (values.position !== '') {
      formData.append('position', values.position);
    }

    try {
      setIsLoading(true);
      await axios.patch(`languages/${selectedId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const respLanguage = await axios.get('/languages', {
        headers: {
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const sortLanguage = respLanguage.data.sort((a, b) =>
        a.position > b.position ? 1 : -1
      );

      setIsLoading(false);
      setLanguage(sortLanguage);
      onClickCloseModal();
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error(error);
    }
  };

  const handleChangeCheck = (value, setFieldValue) => {
    setFieldValue('active', !value);
  };

  return (
    <ModalBlock
      onClose={onClickCloseModal}
      visible={visibleLanguage}
      classes={classes}
      title={selectedModal ? 'Изменить язык' : 'Добавить язык'}
    >
      {isError && (
        <AlertMassege handleCloseMessage={setIsError}>
          {selectedModal
            ? 'Произошла ошибка при изменении языка'
            : 'Произошла ошибка при добавлении языка'}
        </AlertMassege>
      )}
      <FormControl className={classes.formControl} component="fieldset">
        <Formik
          initialValues={{
            name: selectedModal ? selectedModal.name : '',
            image: selectedModal ? selectedModal.imageUrl : '',
            position: selectedModal ? selectedModal.position : '',
            active: selectedModal ? selectedModal.active : false,
          }}
          validationSchema={Schema}
          onSubmit={(values) => {
            if (selectedModal) {
              onEditLanguage(values, selectedModal.id);
            } else {
              onAddLanguage(values);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
            errors,
            touched,
            isValid,
            dirty,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                type="text"
                name="name"
                label="Введите язык"
                style={{ marginBottom: 20 }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                helperText={errors.name && touched.name && String(errors.name)}
                required
                fullWidth
              />
              <TextField
                type="number"
                name="position"
                label="Введите позицию"
                style={{ marginBottom: 20 }}
                onChange={handleChange}
                value={values.position}
                fullWidth
              />

              <ListItem
                onClick={() => handleChangeCheck(values.active, setFieldValue)}
                button
                style={{ padding: 5 }}
              >
                <Checkbox checked={values.active} disableRipple />
                <ListItemText primary="Добавить в приложение" />
              </ListItem>
              <DropZoneBlock
                classes={classes}
                values={values.image}
                selectedDropzone="image"
                placeholder="изображения"
                setFieldValue={setFieldValue}
                preview={imagePreview}
                accept={`${'image/jpeg'}, ${'image/png'}`}
                setPreview={setImagePreview}
              >
                {values.image && (
                  <img
                    src={
                      selectedModal && !imagePreview
                        ? values.image
                        : imagePreview
                    }
                    alt={
                      selectedModal
                        ? selectedModal.imageName
                        : values.image.name
                    }
                    style={{ width: '100%', height: '220px' }}
                  />
                )}
              </DropZoneBlock>
              <Button
                color="primary"
                variant="contained"
                style={{ marginTop: 15 }}
                type="submit"
                disabled={!dirty || !isValid}
                fullWidth
              >
                {selectedModal ? 'Сохранить' : 'Добавить'}
              </Button>
            </form>
          )}
        </Formik>
      </FormControl>
      {isLoading && <LoadingModal />}
    </ModalBlock>
  );
};

export default LanguageModal;

import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

import axios from 'axios';
import {
  AlertMassege,
  DropZoneBlock,
  LoadingModal,
  ModalBlock,
} from '../../../components';
import AppContext from '../../../context';

const CategoryModal = () => {
  const Schema = Yup.object().shape({
    name: Yup.string().required('Обязательное поле'),
    language: Yup.string().required('Обязательное поле'),
    position: Yup.number().required('Обязательное поле'),
  });

  const {
    classes,
    selectedModal,
    language,
    visibleCategory,
    setVisibleCategory,
    setCategories,
    setSelectedModal,
    selectedLanguage,
  } = React.useContext(AppContext);

  const [imagePreview, setImagePreview] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

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
    setVisibleCategory(false);
  };

  const onAddCategory = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('language', values.language);
    formData.append('position', values.position);
    if (values.image !== '') {
      formData.append('image', values.image);
    }

    try {
      setIsLoading(true);
      await axios.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const { data } = await axios.post(
        `/categories/search/`,
        { language: values.language, parent: null },
        {
          headers: {
            Authorization: process.env.REACT_APP_TOKEN,
          },
        }
      );

      const sortCategories = data.sort((a, b) =>
        a.position > b.position ? 1 : -1
      );

      setIsLoading(false);
      setCategories(sortCategories);
      onClickCloseModal();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  const onEditCategory = async (values, selectedId) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('language', values.language);
    formData.append('position', values.position);
    if (values.image !== '') {
      formData.append('image', values.image);
    }

    try {
      setIsLoading(true);
      await axios.patch(`/categories/${selectedId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const { data } = await axios.post(
        `/categories/search/`,
        { language: values.language, parent: null },
        {
          headers: {
            Authorization: process.env.REACT_APP_TOKEN,
          },
        }
      );

      const sortCategories = data.sort((a, b) =>
        a.position > b.position ? 1 : -1
      );

      setIsLoading(false);
      setCategories(sortCategories);
      onClickCloseModal();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  if (!visibleCategory) {
    return null;
  }

  return (
    <ModalBlock
      onClose={onClickCloseModal}
      visible={visibleCategory}
      classes={classes}
      title={selectedModal ? 'Изменить категорию' : 'Добавить категорию'}
    >
      {isError && (
        <AlertMassege handleCloseMessage={setIsError}>
          {selectedModal
            ? 'Произошла ошибка при изменении категории'
            : 'Произошла ошибка при добавлении категории'}
        </AlertMassege>
      )}
      <FormControl className={classes.formControl} component="fieldset">
        <Formik
          initialValues={{
            name: selectedModal ? selectedModal.name : '',
            position: selectedModal ? selectedModal.position : '',
            language: selectedModal ? selectedLanguage : '',
            image: selectedModal ? selectedModal.imageUrl : '',
          }}
          validationSchema={Schema}
          onSubmit={(values) => {
            if (selectedModal) {
              onEditCategory(values, selectedModal.id);
            } else {
              onAddCategory(values);
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
                fullWidth
                label="Имя категории"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                helperText={errors.name && touched.name && String(errors.name)}
                required
              />
              <TextField
                type="number"
                name="position"
                label="Введите позицию"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.position}
                error={touched.position && Boolean(errors.position)}
                helperText={
                  errors.position && touched.position && String(errors.position)
                }
                fullWidth
              />
              <div className={classes.formSelect}>
                <FormControl fullWidth style={{ marginTop: 20 }}>
                  <InputLabel>Выберите Язык</InputLabel>
                  <Select
                    name="language"
                    value={values.language}
                    onChange={handleChange}
                    required
                  >
                    {language.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
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
                style={{ marginTop: 20 }}
                color="primary"
                variant="contained"
                type="submit"
                fullWidth
                disabled={!dirty || !isValid}
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

export default CategoryModal;

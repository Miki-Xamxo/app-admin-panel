import React from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  AlertMassege,
  DropZoneBlock,
  LoadingModal,
  ModalBlock,
} from '../../../components';
import AppContext from '../../../context';

const Schema = Yup.object().shape({
  name: Yup.string().required('Обязательное поле'),
  translate: Yup.string().required('Обязательное поле'),
  category: Yup.string().required('Обязательное поле'),
  language: Yup.string().required('Обязательное поле'),
});

const WordModal = ({ selectedCategory, setSelectedCategory }) => {
  const {
    classes,
    selectedModal,
    visibleWord,
    setVisibleWord,
    language,
    setSelectedModal,
    setShowMassege,
  } = React.useContext(AppContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [categoriesModal, setCategoriesModal] = React.useState([]);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [audioPreview, setAudioPreview] = React.useState(null);
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
    setVisibleWord(false);
  };

  React.useEffect(() => {
    if (selectedModal) {
      (async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.post(
            `/categories/search/`,
            { language: selectedCategory.language.id, parent: null },
            {
              headers: {
                Authorization: process.env.REACT_APP_TOKEN,
              },
            }
          );

          setIsLoading(false);
          setCategoriesModal(data);
        } catch (error) {
          console.error(error);
          setShowMassege(true);
          setIsLoading(false);
          onClickCloseModal();
        }
      })();
    }
  }, []);

  const handleClickLanguage = async (languageId, setFieldValue) => {
    setFieldValue('category', '');
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `/categories/search/`,
        { language: languageId, parent: null },
        {
          headers: {
            Authorization: process.env.REACT_APP_TOKEN,
          },
        }
      );

      setIsLoading(false);
      setCategoriesModal(data);
    } catch (error) {
      console.error(error);
      setShowMassege(true);
      setIsLoading(false);
      onClickCloseModal();
    }
  };

  const onAddWord = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('translate', values.translate);
    formData.append('category', values.category);
    formData.append('language', values.language);
    if (values.image !== '') {
      formData.append('image', values.image);
    }
    if (values.audio !== '') {
      formData.append('audio', values.audio);
    }

    try {
      setIsLoading(true);
      await axios.post('/words', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const resp = await axios.get(`/categories/${values.category}`, {
        headers: {
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });
      setIsLoading(false);
      setSelectedCategory(resp.data);
      onClickCloseModal();
    } catch (error) {
      console.error(error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const onEditWord = async (values, selectedId) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('translate', values.translate);
    formData.append('category', values.category);
    formData.append('language', values.language);
    if (values.image !== '') {
      formData.append('image', values.image);
    }
    if (values.audio !== '') {
      formData.append('audio', values.audio);
    }

    try {
      setIsLoading(true);
      await axios.patch(`/words/${selectedId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      const resp = await axios.get(`/categories/${values.category}`, {
        headers: {
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      setIsLoading(false);
      setSelectedCategory(resp.data);
      onClickCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const debounceSearchWord = React.useCallback(
    debounce(async (value, setFieldValue) => {
      try {
        const resp = await axios.post(
          '/words/search',
          { name: value },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.REACT_APP_TOKEN,
            },
          }
        );

        if (resp.data.length !== 0) {
          setImagePreview(resp.data[0].imageUrl);
          setFieldValue('image', resp.data[0].imageUrl);
        }
      } catch (error) {
        console.error(error);
      }
    }, 300),
    []
  );

  const handleChangeName = (e, setFieldValue) => {
    const name = e.target.value;
    setFieldValue('name', name);
    debounceSearchWord(name, setFieldValue);
  };

  return (
    <ModalBlock
      onClose={onClickCloseModal}
      visible={visibleWord}
      classes={classes}
      title={selectedModal ? 'Изменить слово' : 'Добавить слово'}
    >
      {isError && (
        <AlertMassege handleCloseMessage={setIsError} severity="error">
          Такое слово уже сушествует!
        </AlertMassege>
      )}
      <FormControl className={classes.formControl} component="fieldset">
        <FormGroup aria-label="position" row>
          <Formik
            initialValues={{
              name: selectedModal ? selectedModal.name : '',
              translate: selectedModal ? selectedModal.translate : '',
              category:
                selectedModal || selectedCategory ? selectedCategory.id : '',
              language:
                selectedModal || selectedCategory
                  ? selectedCategory.language.id
                  : '',
              image: selectedModal ? selectedModal.imageUrl : '',
              audio: selectedModal ? selectedModal.audioUrl : '',
            }}
            validationSchema={Schema}
            onSubmit={(values) => {
              if (selectedModal) {
                onEditWord(values, selectedModal.id);
              } else {
                onAddWord(values);
              }
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              dirty,
              errors,
              touched,
              isValid,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  type="text"
                  name="name"
                  label="Введите слово"
                  className={classes.pdr}
                  onChange={(e) => handleChangeName(e, setFieldValue)}
                  onBlur={handleBlur}
                  value={values.name}
                  error={touched.name && Boolean(errors.name)}
                  helperText={
                    errors.name && touched.name && String(errors.name)
                  }
                  required
                />
                <TextField
                  type="text"
                  name="translate"
                  label="Определение"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.translate}
                  error={touched.translate && Boolean(errors.translate)}
                  helperText={
                    errors.translate &&
                    touched.translate &&
                    String(errors.translate)
                  }
                  required
                />
                <div className={classes.formSelect}>
                  <FormControl className={classes.formSelectControl}>
                    <InputLabel>Выберите Категорию</InputLabel>
                    {!selectedModal && selectedCategory ? (
                      <Select
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value={selectedCategory.id}>
                          {selectedCategory.name}
                        </MenuItem>
                      </Select>
                    ) : (
                      <Select
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        required
                      >
                        {categoriesModal.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    <FormHelperText>
                      {errors.category &&
                        touched.category &&
                        String(errors.category)}
                    </FormHelperText>
                  </FormControl>
                  <FormControl className={classes.formSelectControl}>
                    <InputLabel>Выберите Язык</InputLabel>
                    <Select
                      name="language"
                      value={values.language}
                      onChange={handleChange}
                      required
                    >
                      {!selectedModal && selectedCategory ? (
                        <MenuItem value={selectedCategory.language.id}>
                          {selectedCategory.language.name}
                        </MenuItem>
                      ) : (
                        language.map((item) => (
                          <MenuItem
                            onClick={() =>
                              handleClickLanguage(item.id, setFieldValue)
                            }
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </div>
                <DropZoneBlock
                  classes={classes}
                  values={values.image}
                  placeholder="изображения"
                  selectedDropzone="image"
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
                        selectedModal && !imagePreview
                          ? selectedModal.imageName
                          : values.image.name
                      }
                      style={{ width: '100%', height: '220px' }}
                    />
                  )}
                </DropZoneBlock>
                <DropZoneBlock
                  classes={classes}
                  values={values.audio}
                  placeholder="аудио"
                  selectedDropzone="audio"
                  setFieldValue={setFieldValue}
                  preview={audioPreview}
                  selectedModal={selectedModal}
                  accept="audio/*"
                  setPreview={setAudioPreview}
                >
                  <audio
                    controls
                    src={selectedModal ? values.audio : audioPreview}
                  >
                    <track
                      default
                      kind="captions"
                      src={selectedModal ? values.audio : audioPreview}
                    />
                  </audio>
                </DropZoneBlock>
                <Button
                  style={{ marginTop: 20 }}
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={!dirty || !isValid}
                  fullWidth
                >
                  {selectedModal ? 'Сохранить' : 'Добавить'}
                </Button>
              </form>
            )}
          </Formik>
        </FormGroup>
      </FormControl>
      {isLoading && <LoadingModal />}
    </ModalBlock>
  );
};

export default WordModal;

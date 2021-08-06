import React from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  InputLabel,
  Select,
  Paper,
  MenuItem,
} from '@material-ui/core';
import { Formik } from 'formik';
import Dropzone from 'react-dropzone';
import * as Yup from 'yup';
import CloudUpload from '@material-ui/icons/CloudUpload';

import axios from 'axios';
import { LoadingModal, ModalBlock } from '../../../components';
import AppContext from '../../../context';

const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  translate: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  language: Yup.string().required('Required'),
});

const WordModal = ({ selectedCategory, setSelectedCategory }) => {
  const {
    classes,
    selectedModal,
    visibleWord,
    selectedLanguage,
    onClickCloseModal,
    language,
  } = React.useContext(AppContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [categoriesModal, setCategoriesModal] = React.useState([]);

  React.useEffect(() => {
    if (selectedModal) {
      (async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.post(
            `/categories/search/`,
            { language: selectedLanguage, parent: null },
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
        }
      })();
    }
  }, [setCategoriesModal, selectedModal, selectedLanguage]);

  const handleClickLanguage = async (lang, val) => {
    // val.category = '';
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `/categories/search/`,
        { language: lang, parent: null },
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
    }
  };

  const onAddWord = async ({ image, ...values }) => {
    console.log(image);
    console.log(values);

    const formData = new FormData();
    formData.append('image', image);

    console.log(formData);

    try {
      setIsLoading(true);
      await axios.post(
        '/words',
        { ...values, image: formData },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: process.env.REACT_APP_TOKEN,
          },
        }
      );

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

  const onEditWord = async (values, selectedId) => {
    try {
      setIsLoading(true);
      await axios.patch(`/words/${selectedId}`, values, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.REACT_APP_TOKEN,
        },
      });

      setIsLoading(false);

      setSelectedCategory((prev) => {
        if (prev.id === values.category) {
          return {
            ...prev,
            words: prev.words.map((item) => {
              if (item.id === selectedId) {
                return { ...item, ...values };
              }
              return item;
            }),
          };
        }
        return {
          ...prev,
          words: prev.words.filter((item) => item.id !== selectedId),
        };
      });
      onClickCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalBlock
      onClose={onClickCloseModal}
      visible={visibleWord}
      classes={classes}
      title={selectedModal ? 'Изменить слово' : 'Добавить слово'}
    >
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
              image: '',
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
              handleSubmit,
              setFieldValue,
              dirty,
              isValid,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  type="text"
                  name="name"
                  label="Введите слово"
                  className={classes.pdr}
                  onChange={handleChange}
                  value={values.name}
                  required
                />
                <TextField
                  type="text"
                  name="translate"
                  label="Определение"
                  onChange={handleChange}
                  value={values.translate}
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
                            onClick={() => handleClickLanguage(item.id, values)}
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
                {/* <Dropzone
                  onDrop={(acceptedFiles) => {
                    setFieldValue(
                      'image',
                      (values.image = { ...acceptedFiles[0] })
                    );
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Paper
                      className={classes.dropzone}
                      variant="outlined"
                      {...getRootProps()}
                    >
                      {!values.image ? (
                        <CloudUpload className={classes.dropzoneIcon} />
                      ) : (
                        <img
                          src=""
                          alt=""
                          className="img-thumbnail mt-2"
                          height={200}
                          width={200}
                        />
                      )}
                      <input {...getInputProps()} name="image" />
                    </Paper>
                  )}
                </Dropzone> */}
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

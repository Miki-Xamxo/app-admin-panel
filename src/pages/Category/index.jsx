import React from 'react';
import {
  Button,
  CircularProgress,
  TableCell,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
  AlertMassege,
  ContentTop,
  FilterPopup,
  TableBlock,
  TableBodyBlock,
  TableHeadBlock,
} from '../../components';
import CategoryModal from './components/CategoryModal';

const Category = React.memo(
  ({
    classes,
    categories,
    setCategories,
    selectedLanguage,
    setSelectedModal,
    onOpenCategory,
    setShowMassege,
  }) => {
    const [isFetching, setIsFetching] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState('');
    const [isError, setIsError] = React.useState(false);

    React.useEffect(() => {
      (async () => {
        try {
          if (selectedLanguage) {
            setIsFetching(true);
            const respCategories = await axios.post(
              `/categories/search/`,
              { language: selectedLanguage, parent: null },
              {
                headers: {
                  Authorization: process.env.REACT_APP_TOKEN,
                },
              }
            );

            const sortCategories = respCategories.data.sort((a, b) =>
              a.position > b.position ? 1 : -1
            );

            setIsFetching(false);
            setCategories(sortCategories);
          }
        } catch (error) {
          console.error(error);
          setShowMassege(true);
          setIsFetching(false);
        }
      })();
    }, [selectedLanguage]);

    const onClickEditCategory = (obj) => {
      setSelectedModal(obj);
      onOpenCategory();
    };

    const onRemoveItem = async (id) => {
      if (window.confirm('Вы действительно хотите удалить?')) {
        try {
          await axios.delete(`categories/${id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });
          setCategories((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
          setIsError(true);
          console.error(error);
        }
      }
    };

    return (
      <>
        {isError && (
          <AlertMassege handleCloseMessage={setIsError}>
            Произошла ошибка при удалении категории
          </AlertMassege>
        )}
        <ContentTop
          onClick={onOpenCategory}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <FilterPopup />
        {!isFetching ? (
          <TableBlock>
            <TableHeadBlock>
              <TableCell align="center">Категория</TableCell>
              <TableCell align="center" style={{ width: '20%' }}>
                Позиция
              </TableCell>
              <TableCell align="center" style={{ width: '20%' }}>
                Картинка
              </TableCell>
              <TableCell align="center" style={{ width: '50%' }}>
                Действия
              </TableCell>
            </TableHeadBlock>
            {categories
              .filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((item) => (
                <TableBodyBlock key={item.id}>
                  <TableCell align="center">
                    <Link to={`/categories/${item.id}`}>{item.name}</Link>
                  </TableCell>
                  <TableCell align="center">{item.position}</TableCell>
                  <TableCell align="center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.imageName}
                        style={{ width: '70px', height: '40px' }}
                      />
                    ) : (
                      <Typography>Нет картинки</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onClickEditCategory(item)}
                      className={classes.btnEdit}
                    >
                      Изменить
                    </Button>
                    <Button
                      onClick={() => onRemoveItem(item.id)}
                      variant="contained"
                      color="primary"
                      className={classes.btnRemove}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableBodyBlock>
              ))}
          </TableBlock>
        ) : (
          <CircularProgress style={{ width: 70, height: 70 }} />
        )}
        <CategoryModal />
      </>
    );
  }
);

export default Category;

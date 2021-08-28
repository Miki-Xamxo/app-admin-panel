import React from 'react';
import axios from 'axios';
import { Button, TableCell, Typography } from '@material-ui/core';

import {
  AlertMassege,
  ContentTop,
  TableBlock,
  TableBodyBlock,
  TableHeadBlock,
} from '../../components';
import LanguageModal from './components/LanguageModal';

const Language = React.memo(
  ({ classes, language, setLanguage, onOpenLanguage, setSelectedModal }) => {
    const [searchValue, setSearchValue] = React.useState('');
    const [isError, setIsError] = React.useState(false);

    const onClickOpenEdit = (obj) => {
      setSelectedModal(obj);
      onOpenLanguage();
    };

    const onRemoveItem = async (id) => {
      if (window.confirm('Вы действительно хотите удалить?')) {
        try {
          await axios.delete(`languages/${id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });
          setLanguage((prev) => prev.filter((item) => item.id !== id));
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
            Произошла ошибка при удалении языка
          </AlertMassege>
        )}
        <ContentTop
          onClick={onOpenLanguage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <TableBlock>
          <TableHeadBlock>
            <TableCell align="center" style={{ width: '30%' }}>
              Язык
            </TableCell>
            <TableCell align="center">Картинки</TableCell>
            <TableCell align="center">Позиция</TableCell>
            <TableCell align="center">Активация</TableCell>
            <TableCell align="center">Действия</TableCell>
          </TableHeadBlock>
          {language
            .filter((item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <TableBodyBlock key={item.id}>
                <TableCell align="center">{item.name}</TableCell>
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
                <TableCell align="center">{item.position}</TableCell>
                <TableCell align="center">
                  {item.active ? 'Активный' : 'Не активный'}
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => onClickOpenEdit(item)}
                    variant="contained"
                    color="secondary"
                    className={classes.btnEdit}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.btnRemove}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableBodyBlock>
            ))}
        </TableBlock>
        <LanguageModal />
      </>
    );
  }
);

export default Language;

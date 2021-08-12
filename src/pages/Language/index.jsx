import React from 'react';
import axios from 'axios';
import { Button, TableCell, Typography } from '@material-ui/core';

import {
  ContentTop,
  TableBlock,
  TableBodyBlock,
  TableHeadBlock,
} from '../../components';
import LanguageModal from './components/LanguageModal';

const Language = React.memo(
  ({ classes, language, setLanguage, onOpenLanguage, setSelectedModal }) => {
    const [searchValue, setSearchValue] = React.useState('');

    const onClickOpenEdit = (obj) => {
      console.log(obj);
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
          console.error(error);
        }
      }
    };

    return (
      <>
        <ContentTop
          onClick={onOpenLanguage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <TableBlock>
          <TableHeadBlock>
            <TableCell style={{ width: '30%' }}>Язык</TableCell>
            <TableCell>Картинки</TableCell>
            <TableCell>Позиция</TableCell>
            <TableCell>Активация</TableCell>
            <TableCell>Действия</TableCell>
          </TableHeadBlock>
          {language
            .filter((item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <TableBodyBlock key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
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
                <TableCell>{item.position}</TableCell>
                <TableCell>
                  {item.active ? 'Активный' : 'Не активный'}
                </TableCell>
                <TableCell>
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

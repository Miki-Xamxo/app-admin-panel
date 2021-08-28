import React from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button, TableCell, CircularProgress, Avatar } from '@material-ui/core';

import {
  ContentTop,
  TableBlock,
  TableBodyBlock,
  TableHeadBlock,
  ModalImage,
  AlertMassege,
} from '../../components';
import WordModal from './components/WordModal';

const Word = React.memo(
  ({
    classes,
    setSelectedModal,
    onOpenWord,
    setShowMassege,
    selectedCategory,
    setSelectedCategory,
    visibleWord,
  }) => {
    const [isFetching, setIsFetching] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState('');
    const [visibleImage, setVisibleImage] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [isError, setIsError] = React.useState(false);

    const params = useParams();

    React.useEffect(() => {
      (async () => {
        try {
          const resp = await axios.get(`/categories/${params.id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });

          setSelectedCategory(resp.data);
          setIsFetching(false);
        } catch (error) {
          setShowMassege(true);
          setIsFetching(false);
          console.error(error);
        }
      })();
    }, []);

    const onClickOpenEdit = (obj) => {
      setSelectedModal(obj);
      onOpenWord();
    };

    const handleSelectedImage = (obj) => {
      setSelectedImage(obj);
      setVisibleImage(true);
    };

    const handleCloseModalImage = () => {
      setVisibleImage(false);
    };

    const onRemoveItem = async (id) => {
      if (window.confirm('Вы действительно хотите удалить?')) {
        try {
          await axios.delete(`/words/${id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });
          setSelectedCategory((prev) => ({
            ...prev,
            words: prev.words.filter((item) => item.id !== id),
          }));
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
            Произошла ошибка при удалении слова
          </AlertMassege>
        )}
        <Button>
          <Link to="/categories">Вернуться назад</Link>
        </Button>
        <ContentTop
          onClick={onOpenWord}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {!isFetching ? (
          <TableBlock>
            <TableHeadBlock>
              <TableCell align="center">Слово</TableCell>
              <TableCell align="center">Определение</TableCell>
              <TableCell align="center">Картинка</TableCell>
              <TableCell align="center">Аудио</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableHeadBlock>
            {selectedCategory &&
              selectedCategory.words
                .filter((item) =>
                  item.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((item) => (
                  <TableBodyBlock key={item.id}>
                    <TableCell align="center" variant="body">
                      {item.name}
                    </TableCell>
                    <TableCell align="center">{item.translate}</TableCell>
                    <TableCell align="center">
                      {item.imageUrl ? (
                        <Avatar
                          variant="square"
                          aria-label="recipe"
                          alt={item.imageNamde}
                          src={item.imageUrl}
                          style={{
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            handleSelectedImage({
                              imageUrl: item.imageUrl,
                              imageName: item.imageName,
                            })
                          }
                        />
                      ) : (
                        'Нет картинки'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {item.audioUrl ? (
                        <AudioPlayer
                          style={{
                            boxShadow: 'none',
                            background: 'none',
                            padding: 0,
                          }}
                          src={item.audioUrl}
                          customAdditionalControls={[]}
                          customProgressBarSection={[]}
                          customVolumeControls={[]}
                          showJumpControls={false}
                          showDownloadProgress={false}
                        />
                      ) : (
                        'Нет аудио'
                      )}
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
        ) : (
          <CircularProgress style={{ width: 70, height: 70 }} />
        )}

        {visibleWord && (
          <WordModal
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {visibleImage && (
          <ModalImage visible={visibleImage} onClose={handleCloseModalImage}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.imageName}
              style={{ width: '100%', height: '420px' }}
            />
          </ModalImage>
        )}
      </>
    );
  }
);

export default Word;

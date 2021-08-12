import React from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  Button,
  TableCell,
  CircularProgress,
  Avatar,
  Typography,
} from '@material-ui/core';

import {
  ContentTop,
  TableBlock,
  TableBodyBlock,
  TableHeadBlock,
  ModalImage,
} from '../../components';
import WordModal from './components/WordModal';

const Word = React.memo(
  ({
    classes,
    setSelectedModal,
    onOpenWord,
    selectedCategory,
    setSelectedCategory,
    visibleWord,
  }) => {
    const [isFetching, setIsFetching] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState('');
    const [visibleImage, setVisibleImage] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);

    const params = useParams();

    React.useEffect(() => {
      (async () => {
        try {
          const resp = await axios.get(`/categories/${params.id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });

          setIsFetching(false);
          setSelectedCategory(resp.data);
        } catch (error) {
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
          setSelectedCategory((prev) => ({
            ...prev,
            words: prev.words.filter((item) => item.id !== id),
          }));
          await axios.delete(`/words/${id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    return (
      <>
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
              <TableCell>Слово</TableCell>
              <TableCell>Определение</TableCell>
              <TableCell>Картинка</TableCell>
              <TableCell>Аудио</TableCell>
              <TableCell>Действия</TableCell>
            </TableHeadBlock>
            {selectedCategory &&
              selectedCategory.words
                .filter((item) =>
                  item.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((item) => (
                  <TableBodyBlock key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.translate}</TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <Avatar
                          alt={item.imageName}
                          src={item.imageUrl}
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            handleSelectedImage({
                              imageUrl: item.imageUrl,
                              imageName: item.imageName,
                            })
                          }
                        />
                      ) : (
                        <Typography>Нет картинки</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.audioUrl ? (
                        <AudioPlayer
                          style={{
                            boxShadow: 'none',
                            background: 'none',
                            padding: 0,
                          }}
                          src={item.audioUrl}
                          layout="horizontal-reverse"
                          customAdditionalControls={[]}
                          customProgressBarSection={[]}
                          customVolumeControls={[]}
                          showJumpControls={false}
                        />
                      ) : (
                        <Typography>Нет аудио</Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ width: '30%' }}>
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
              style={{ width: '400px', height: '420px' }}
            />
          </ModalImage>
        )}
      </>
    );
  }
);

export default Word;

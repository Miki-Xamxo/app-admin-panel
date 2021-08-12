import React from 'react';
import { Paper, TextField, Typography } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import WordModal from './Word/components/WordModal';
import CategoryModal from './Category/components/CategoryModal';
import LanguageModal from './Language/components/LanguageModal';

const Home = React.memo(
  ({
    classes,
    onOpenWord,
    visibleWord,
    selectedCategory,
    setSelectedCategory,
    onOpenCategory,
    onOpenLanguage,
  }) => {
    const [image, setImage] = React.useState('');

    React.useEffect(() => {
      setSelectedCategory(null);
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      console.log(image);
    };

    return (
      <>
        <div className={classes.contentAdd}>
          <Paper onClick={onOpenWord} className={classes.btnAdd}>
            <AddIcon
              className={classes.btnAddIcon}
              style={{ backgroundColor: 'rgb(67, 176, 92)' }}
            />
            <Typography style={{ fontSize: 20, marginLeft: 10 }} variant="h6">
              Добавить слово
            </Typography>
          </Paper>
          <Paper onClick={onOpenCategory} className={classes.btnAdd}>
            <AddIcon
              className={classes.btnAddIcon}
              style={{ backgroundColor: 'rgb(29, 161, 242)' }}
            />
            <Typography style={{ fontSize: 20, marginLeft: 10 }} variant="h6">
              Добавить категорию
            </Typography>
          </Paper>
          <Paper onClick={onOpenLanguage} className={classes.btnAdd}>
            <AddIcon
              className={classes.btnAddIcon}
              style={{ backgroundColor: 'red' }}
            />
            <Typography style={{ fontSize: 20, marginLeft: 10 }} variant="h6">
              Добавить язык
            </Typography>
          </Paper>
        </div>
        {visibleWord && (
          <WordModal
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        <CategoryModal />
        <LanguageModal />
        {/* <form onSubmit={handleSubmit}>
        <input
          name="image"
          type="file"
          onChange={(e) => setImage(e.target.files)}
          // value={image}
        />
        <button type="submit">Отправить</button>
        </form> */}
      </>
    );
  }
);

export default Home;

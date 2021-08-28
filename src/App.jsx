import React from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import AppContext from './context';
import { Header, DrawerBlock, AlertMassege } from './components';
import { Word, Category, Language, Home } from './pages';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
  },
  iconButton: {
    padding: 10,
  },
  container: {
    width: '1000px',
    margin: '80px auto',
  },

  contentTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '50px',
  },

  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },

  pdr: {
    paddingRight: '30px',
  },

  formSelectControl: {
    marginTop: theme.spacing(3),
    width: 180,
  },

  formSelect: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  inputSearch: {
    padding: 10,
  },

  btnRemove: {
    backgroundColor: 'red',
    padding: '5px 10px',

    '&:hover': {
      backgroundColor: 'rgb(200, 0, 0)',
    },
  },

  btnEdit: {
    marginRight: 20,
    padding: '5px 10px',
    backgroundColor: '#43a047',

    '&:hover': {
      backgroundColor: 'rgb(46, 112, 49)',
    },
  },

  btnAdd: {
    display: 'flex',
    alignItems: 'center',
    width: 300,
    cursor: 'pointer',
    padding: 15,
    transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',

    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },

  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    opacity: '0.2',
    backgroundColor: 'rgb(0, 0, 0)',
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
  },

  btnAddIcon: {
    width: 40,
    marginRight: 10,
    color: '#fff',
    borderRadius: 50,
    height: 40,
  },

  contentAdd: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 40,
  },

  dropzone: {
    backgroundColor: '#eee',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#333',
    padding: '10px',
    marginTop: '20px',
  },

  dropzoneIcon: {
    marginTop: '16px',
    color: '#888888',
    fontSize: '42px',
  },
}));

function App() {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [visibleWord, setVisibleWord] = React.useState(false);
  const [visibleCategory, setVisibleCategory] = React.useState(false);
  const [visibleLanguage, setVisibleLanguage] = React.useState(false);
  const [selectedModal, setSelectedModal] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [language, setLanguage] = React.useState([]);
  const [showMessage, setShowMassege] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const respLanguage = await axios.get('/languages', {
          headers: {
            Authorization: process.env.REACT_APP_TOKEN,
          },
        });

        const sortLanguage = respLanguage.data.sort((a, b) =>
          a.position > b.position ? 1 : -1
        );

        setLanguage(sortLanguage);
        setSelectedLanguage(sortLanguage[0].id);
      } catch (error) {
        setShowMassege(true);
        console.log(error);
      }
    })();
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleOpenModalWord = React.useCallback(() => {
    setVisibleWord(true);
  }, []);

  const handleOpenModalCategory = React.useCallback(() => {
    setVisibleCategory(true);
  }, []);

  const handleOpenModalLanguage = React.useCallback(() => {
    setVisibleLanguage(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        classes,
        setCategories,
        language,
        categories,
        setLanguage,
        visibleCategory,
        setVisibleCategory,
        visibleWord,
        setVisibleWord,
        setVisibleLanguage,
        visibleLanguage,
        selectedModal,
        setShowMassege,
        selectedLanguage,
        setSelectedModal,
        setSelectedLanguage,
      }}
    >
      <div className={classes.wrapper}>
        <Header handleDrawerOpen={handleDrawerOpen} />
        <DrawerBlock handleDrawerClose={handleDrawerClose} open={drawerOpen} />
        <main>
          <div className={classes.container}>
            <div className={classes.content}>
              {showMessage && (
                <AlertMassege handleCloseMessage={setShowMassege}>
                  Произошла ошибка при запросе данных! Пожалуйста обновите
                  страницу
                </AlertMassege>
              )}
              <Switch>
                <Route path="/" exact>
                  <Home
                    classes={classes}
                    onOpenWord={handleOpenModalWord}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onOpenCategory={handleOpenModalCategory}
                    onOpenLanguage={handleOpenModalLanguage}
                    visibleWord={visibleWord}
                  />
                </Route>
                <Route path="/categories" exact>
                  <Category
                    classes={classes}
                    categories={categories}
                    selectedLanguage={selectedLanguage}
                    setCategories={setCategories}
                    setShowMassege={setShowMassege}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedModal={setSelectedModal}
                    setVisibleCategory={setVisibleCategory}
                    onOpenCategory={handleOpenModalCategory}
                  />
                </Route>

                <Route path="/categories/:id" exact>
                  <Word
                    classes={classes}
                    setSelectedModal={setSelectedModal}
                    onOpenWord={handleOpenModalWord}
                    setShowMassege={setShowMassege}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    visibleWord={visibleWord}
                  />
                </Route>

                <Route path="/language" exact>
                  <Language
                    classes={classes}
                    language={language}
                    setLanguage={setLanguage}
                    onOpenLanguage={handleOpenModalLanguage}
                    setSelectedModal={setSelectedModal}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;

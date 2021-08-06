import React from "react";
import { Button, CircularProgress, TableCell } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  ContentTop,
  FilterPopup,
  TableBlock,
  TableBodyBlock,
  TableHeadBlock,
} from "../../components";
import CategoryModal from "./components/CategoryModal";

const Category = React.memo(
  ({
    classes,
    categories,
    setCategories,
    selectedLanguage,
    setSelectedModal,
    onOpenCategory,
  }) => {
    const [isFetching, setIsFetching] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState("");

    React.useEffect(() => {
      (async () => {
        try {
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

          setIsFetching(false);
          setCategories(respCategories.data);
        } catch (error) {
          console.error(error);
        }
      })();
    }, [selectedLanguage, setCategories]);

    const onClickEditCategory = (obj) => {
      setSelectedModal(obj);
      onOpenCategory();
    };

    const onRemoveItem = async (id) => {
      if (window.confirm("Вы действительно хотите удалить?")) {
        try {
          await axios.delete(`categories/${id}`, {
            headers: {
              Authorization: process.env.REACT_APP_TOKEN,
            },
          });
          setCategories((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
          console.error(error);
        }
      }
    };

    return (
      <>
        <ContentTop
          onClick={onOpenCategory}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <FilterPopup />
        {!isFetching ? (
          <TableBlock>
            <TableHeadBlock>
              <TableCell>Категория</TableCell>
              <TableCell>Действия</TableCell>
            </TableHeadBlock>
            {categories
              .filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((item) => (
                <TableBodyBlock key={item.id}>
                  <Link to={`/categories/${item.id}`}>
                    <TableCell style={{ width: "70%", cursor: "pointer" }}>
                      {item.name}
                    </TableCell>
                  </Link>
                  <TableCell>
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

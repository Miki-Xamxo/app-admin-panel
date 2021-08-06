import React from 'react';
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@material-ui/core';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ExpandMore from '@material-ui/icons/ExpandMore';

import AppContext from '../context';

const FilterPopup = () => {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const { selectedLanguage, language, setSelectedLanguage } =
    React.useContext(AppContext);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = (id) => {
    setChecked(true);
    setSelectedLanguage(id);
  };

  return (
    <List style={{ width: '40%', marginBottom: 40 }} component={Paper}>
      <ListItem style={{ cursor: 'pointer' }} onClick={handleClick}>
        <ListItemText primary="Фильтр" />
        {open ? (
          <ExpandMore fontSize="large" />
        ) : (
          <ArrowForwardIosIcon fontSize="small" />
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ListItemText primary="Язык" style={{ marginLeft: 20 }} />
        <List component="div" disablePadding>
          {language.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => handleChange(item.id)}
              button
            >
              <Checkbox
                checked={selectedLanguage === item.id && checked}
                disableRipple
              />
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  );
};

export default FilterPopup;

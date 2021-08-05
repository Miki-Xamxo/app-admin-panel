import React from 'react'
import { IconButton, List, ListItem, ListItemText, Drawer } from '@material-ui/core'
import {  NavLink } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';


const useStylesDrawer = makeStyles((theme) => ({
    drawer: {
        width: 240,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 240,
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },

    link: {
        color: '#000',
    },

    active: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
}))



const DrawerBlock = ({ handleDrawerClose, open}) => {

    const classes = useStylesDrawer();

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronRightIcon />
                </IconButton>
            </div>
            <List>
                <ListItem button style={{ padding: 0 }}>
                    <NavLink exact to='/' style={{ padding: 10, width: '100%', color: '#000' }} activeClassName={classes.active}>
                            <ListItemText>
                                Главная
                            </ListItemText>
                    </NavLink>
                </ListItem>
                <ListItem button style={{ padding: 0 }}>
                    <NavLink  to='/categories' style={{ padding: 10, width: '100%', color: '#000' }} activeClassName={classes.active}>
                            <ListItemText>
                                Категории
                            </ListItemText>
                    </NavLink>
                </ListItem>
                <ListItem button style={{ padding: 0 }}>
                    <NavLink exact to='/language' style={{ padding: 10, width: '100%', color: '#000' }} activeClassName={classes.active}>
                            <ListItemText>
                                Языки
                            </ListItemText>
                    </NavLink>
                </ListItem>
                </List>
            </Drawer>
    )
}

export default DrawerBlock

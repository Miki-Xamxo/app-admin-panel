import React from 'react'
import { Button, IconButton, InputBase, Paper } from '@material-ui/core'

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search'

import AppContext from '../context'


const ContentTop = ({ onClick, searchValue, setSearchValue }) => {

    const { classes } = React.useContext(AppContext)


        const onChangeSearchValue =(e) => {
            setSearchValue(e.target.value)
        }
        
        const onClickClearInput =() => {
            setSearchValue('')
        }
        

    return (
        <div className={classes.contentTop}>
            <Paper component='form'>
                <InputBase
                    value={searchValue}
                    className={classes.inputSearch}
                    onChange={onChangeSearchValue}
                    placeholder='Поиск'
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
                {
                    searchValue 
                    ?   <IconButton onClick={onClickClearInput} className={classes.iconButton}  aria-label='search'>
                            <ClearIcon />
                        </IconButton>
                    : <IconButton  className={classes.iconButton} aria-label='search' disabled>
                            <SearchIcon />
                        </IconButton>
                }
            </Paper>
            <Button onClick={onClick} variant='contained' color='primary' disableElevation>
                Добавить
            </Button>
        </div>
    )
}

export default ContentTop

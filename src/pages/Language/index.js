import React from 'react'
import axios from 'axios'
import { Button, TableCell } from '@material-ui/core'

import { ContentTop, TableBlock, TableBodyBlock, TableHeadBlock } from '../../components'
import LanguageModal from './components/LanguageModal'

const Language = React.memo(({classes, language, setLanguage,  onOpenLanguage, setSelectedModal  }) => {

    const [searchValue, setSearchValue] = React.useState('')

    const onClickOpenEdit = (obj) => {
        setSelectedModal(obj)
        onOpenLanguage()
    }




    const onRemoveItem = async (id) => {
        if(window.confirm('Вы действительно хотите удалить?')){
            try{
                await axios.delete(`languages/${id}`, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                    },
                })
                setLanguage(prev => prev.filter(item => item.id !== id))
            }catch(error){
                console.error(error)
            }
        }
    }


    return <>
        <ContentTop onClick={onOpenLanguage} searchValue={searchValue} setSearchValue={setSearchValue} />
        <TableBlock>
            <TableHeadBlock>
                <TableCell style={{ width: '70%' }}>Язык</TableCell>
                <TableCell>Действия</TableCell>
            </TableHeadBlock>
            {
                language
                .filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
                .map(item => <TableBodyBlock key={item.id}>
                    <TableCell>{item.name}</TableCell>
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
                </TableBodyBlock> )
            }
        </TableBlock>
        <LanguageModal  />
    </>
})

export default Language

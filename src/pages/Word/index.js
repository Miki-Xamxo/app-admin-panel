import React from 'react'
import axios from 'axios'
import { Link, useParams} from 'react-router-dom'
import { Button, TableCell } from '@material-ui/core'

import { CircularProgress } from '@material-ui/core'

import { ContentTop, TableBlock, TableBodyBlock, TableHeadBlock  } from '../../components'
import  WordModal  from './components/WordModal'


const Word = React.memo(({
    classes, 
    setSelectedModal,
    onOpenWord,
    selectedCategory,
    setSelectedCategory,
    visibleWord
}) => {

    const [isFetching, setIsFetching] = React.useState(true)
    const [searchValue, setSearchValue] = React.useState('')


    const params = useParams()


    React.useEffect(() => {
        (async () => {
            try{
                const resp = await axios.get(`/categories/${params.id}`, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                    },
                })

                setIsFetching(false)
                setSelectedCategory(resp.data)
            }catch(error){
                console.error(error)
            }
        })()
    }, [setSelectedCategory])


    const onClickOpenEdit = (obj) => {
        setSelectedModal(obj)
        onOpenWord()
    }


    const onRemoveItem = async (id) => {
        if(window.confirm('Вы действительно хотите удалить?')){
            try{
                setSelectedCategory(prev => {
                    return {...prev, words: prev.words.filter(item => item.id !== id)}
                })
                await axios.delete(`/words/${id}`, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                    },
                })
            }catch(error){
                console.error(error)
            }
        }
    }


    return <>
        <Button>
            <Link to='/categories'>Вернуться назад</Link>
        </Button>
        <ContentTop 
        onClick={onOpenWord} 
        searchValue={searchValue} setSearchValue={setSearchValue} 
        />
        {
            !isFetching
                ?    <TableBlock>
                        <TableHeadBlock>
                            <TableCell>Слово</TableCell>
                            <TableCell>Определение</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableHeadBlock>
                        {
                            selectedCategory && selectedCategory.words
                                .filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
                                .map(item => <TableBodyBlock key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.translate}</TableCell>
                                    <TableCell style={{ width: '30%' }} >
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
                                </TableBodyBlock>)
                        }
                    </TableBlock>
            : <CircularProgress style={{ width: 70, height: 70}}/>
        }

        { visibleWord && <WordModal selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}  />}
    </>
})

export default Word
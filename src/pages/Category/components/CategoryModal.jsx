import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { Button, 
        FormControl, 
        InputLabel,
        MenuItem, 
        Select, 
        TextField } from '@material-ui/core'

import { LoadingModal, ModalBlock } from '../../../components'
import AppContext from '../../../context'
import axios from 'axios';

const CategoryModal = () => {

    const Schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        language: Yup.string().required('Required'),
    });

    const { classes, 
            selectedModal, 
            language,
            visibleCategory,
            onClickCloseModal,
            setCategories,
            selectedLanguage} = React.useContext(AppContext)

    const [isLoading,  setIsLoading] = React.useState(false)


    const onAddCategory = async (values) => {
        try{
            setIsLoading(true)
            await axios.post('/categories', {...values, position: 1}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                },
            })
            
            const { data } =  await axios.post(`/categories/search/`, { language: values.language, parent: null },  {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                },
            })
            
            setIsLoading(false)
            setCategories(data)
            onClickCloseModal()
        }catch(error){
            console.error(error)
        }
    }

    const onEditCategory = async (values, selectedId) => {
        try{
            setIsLoading(true)
            await axios.patch(`/categories/${selectedId}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                },
            })

            setIsLoading(false)
            setCategories(prev => prev.map(item => {
                if(item.id === selectedId){
                    return {...item, ...values}
                }
                return item
            }))
            onClickCloseModal()
        }catch(error){
            console.error(error)
        }
    }

    if(!visibleCategory){
        return null
    }

    return (
        <ModalBlock 
            onClose={onClickCloseModal} 
            visible={visibleCategory} 
            classes={classes} 
            title={ selectedModal ? 'Изменить категорию' : 'Добавить категорию'}
        >
            <FormControl className={classes.formControl} component='fieldset'>
                <Formik
                    initialValues={{ 
                        name: selectedModal ? selectedModal.name : '',
                        language: selectedModal ? selectedLanguage : '' 
                    }}
                    validationSchema={Schema}
                    onSubmit={(values) => {
                        if(selectedModal){
                            onEditCategory(values, selectedModal.id)
                        }else{
                            onAddCategory(values)
                        }
                    }}
                >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    isValid,
                    dirty
                }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            type='text'
                            name='name'
                            fullWidth
                            label='Имя категории'
                            onChange={handleChange}
                            value={values.name}
                            required
                        />
                        <div className={classes.formSelect}>
                            <FormControl  fullWidth style={{ marginTop: 20 }}>
                                <InputLabel>
                                    Выберите Язык
                                </InputLabel>
                                <Select
                                    name='language'
                                    value={values.language}
                                    onChange={handleChange}
                                    required
                                >
                                    {
                                        language.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <Button 
                            color='primary' 
                            variant="contained" 
                            type='submit' fullWidth
                            disabled={!dirty || !isValid}
                        >
                            {
                                selectedModal ? 'Сохранить' : 'Добавить' 
                            }
                        </Button>
                    </form>
                )}
                </Formik>
            </FormControl>
            {
                isLoading && <LoadingModal />
            }
        </ModalBlock>
    )
}

export default CategoryModal

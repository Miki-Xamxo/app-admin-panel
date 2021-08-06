import React from 'react'
import { Button, FormControl, TextField} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingModal, ModalBlock } from '../../../components';
import AppContext from '../../../context';
import axios from 'axios';

const LanguageModal = () => {

    const Schema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });
    

    const {classes,
            selectedModal, 
            visibleLanguage,
            setLanguage, 
            onClickCloseModal } = React.useContext(AppContext)

    const [isLoading,  setIsLoading] = React.useState(false)


    if(!visibleLanguage){
        return null
    }

    const onAddLanguage = async (values) => {
        try{
            setIsLoading(true)
            const { data } = await axios.post('/languages', values, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                },
            })
    
            setIsLoading(false)
            setLanguage(prev => [...prev, data])
            onClickCloseModal()
        }catch(error){
            console.error(error)
        }
    }


    const onEditLanguage = async (values, selectedId) => {
        try{
            setIsLoading(true)
            await axios.patch(`languages/${selectedId}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                },
            })

            setIsLoading(false)
            setLanguage(prev => prev.map(item => {
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

    return (
        <ModalBlock 
            onClose={onClickCloseModal} 
            visible={ visibleLanguage} 
            classes={classes} 
            title={selectedModal ? 'Изменить язык' : 'Добавить язык'}
        >
                <FormControl className={classes.formControl} component='fieldset'>
                    <Formik
                            initialValues={{ 
                                name: selectedModal ? selectedModal.name : ''
                            }}
                            validationSchema={Schema}
                            onSubmit={(values) => {
                                if(selectedModal){
                                    onEditLanguage(values, selectedModal.id)
                                }else{
                                    onAddLanguage(values)
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
                                    label='Введите язык'
                                    style={{ marginBottom: 20 }}
                                    onChange={handleChange}
                                    value={values.name}
                                    required
                                    fullWidth
                                />
                                <Button 
                                    color='primary' 
                                    variant="contained" 
                                    type='submit'
                                    disabled={!dirty || !isValid} 
                                    fullWidth>
                                    {
                                        selectedModal ? 'Сохранить' : 'Добавить' 
                                    }
                                </Button>
                            </form>
                        )}
                    </Formik>
                </FormControl>
                { 
                    isLoading &&  <LoadingModal />
                }
        </ModalBlock>
    )
}

export default LanguageModal

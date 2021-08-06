import React from 'react'
import { Button, FormControl, FormGroup, 
    TextField, InputLabel, Select, Paper, MenuItem} from '@material-ui/core';
import {  Formik } from 'formik';
import Dropzone from "react-dropzone";
import {useDropzone} from 'react-dropzone'
import * as Yup from 'yup';
import CloudUpload from '@material-ui/icons/CloudUpload';


import { LoadingModal, ModalBlock} from '../../../components';
import AppContext from '../../../context';
import axios from 'axios';

const Schema = Yup.object().shape({
    name: Yup.string().required('Required'),
    translate: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    language: Yup.string().required('Required'),
});

const WordModal =  ({selectedCategory, setSelectedCategory}) => {

    const { classes, 
            selectedModal, 
            visibleWord,
            selectedLanguage,
            onClickCloseModal, 
            language} = React.useContext(AppContext)



            const onDrop = React.useCallback((files) => {
                files.forEach((file) => {
                    const reader = new FileReader()

                    reader.onabort = () => console.log('file reading was aborted')
                    reader.onerror = () => console.log('file reading has failed')
                    reader.onload = () => {
                        // Do whatever you want with the file contents
                        const binaryStr = reader.result
                        console.log(binaryStr)
                    }
                    // reader.readAsArrayBuffer(file)
                })
            }, [])

        const [isLoading,  setIsLoading] = React.useState(false)
        const [categoriesModal, setCategoriesModal] = React.useState([])
        const {getRootProps, getInputProps} = useDropzone({onDrop})




        React.useEffect(() => {
            if(selectedModal){
                (async () => {
                    try{
                        setIsLoading(true)
                        const { data } = await axios.post(`/categories/search/`, {  language: selectedLanguage, parent: null },  {
                            headers: {
                                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE',
                            },
                        })
                        
                        setIsLoading(false)
                        setCategoriesModal(data)
                        
                    }catch(error){
                        console.error(error)
                    }
                })()
            }
        }, [setCategoriesModal, selectedModal, selectedLanguage])


        const handleClickLanguage = async (language, val) => {
            val.category = ''
            try{
                setIsLoading(true)
                const { data } = await axios.post(`/categories/search/`, { language, parent: null },  {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'                    
                    },
                })
                
                setIsLoading(false)
                setCategoriesModal(data)
                
            }catch(error){
                console.error(error)
            }
        }

    const onAddWord = async ({image, ...values}) => {

        console.log(image)

        const formData = new FormData()
        formData.append("file", image)

        const dataImage = formData.get("image")

        // try{
        //     setIsLoading(true)
        //     await axios.post('/words', {...values, image: dataImage}, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'               
        //         },
        //     })
    
        //     const resp = await axios.get(`/categories/${values.category}`, {
        //         headers: {
        //             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
        //         },
        //     })
        //     setIsLoading(false)
        //     setSelectedCategory(resp.data)
        //     onClickCloseModal()
        // }catch(error){
        //     console.error(error)
        // }
    }
    

    const onEditWord = async (values, selectedId) => {
        try{
            setIsLoading(true)
            await axios.patch(`/words/${selectedId}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyMmRhMDUwLTBjMzYtNDdkMi1hZWU4LTRlODQ3Y2Q4NDU5NSIsImVtYWlsIjoiYWRhbTIyMTg1NTE1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkFkYW0iLCJsYXN0TmFtZSI6IkJhbGtvZXYiLCJyb2xlcyI6W3siaWQiOiI4YjEyZjUzYy0wNmE0LTRjODctYWJlMy0xOTkwYjQ1NzBkOTkiLCJuYW1lIjoiQWRtaW4ifV0sImlhdCI6MTYyNTkxNzcyOSwiZXhwIjoxNjMzNjkzNzI5fQ.ieOm_eF_2-N5KtVLh4N3O5xaLgDEL6VvjrtGkafmFTE'
                },
            })

            setIsLoading(false)

            setSelectedCategory(prev => {
                if(prev.id === values.category){
                    return {...prev, words: prev.words.map(item => {
                        if(item.id === selectedId){
                            return {...item, ...values}
                        }
                        return item
                    })}
                }else{
                    return {...prev, words: prev.words.filter(item => item.id !== selectedId)}
                }
            })
            onClickCloseModal()
        }catch(error){
            console.error(error)
        }
    }

    return (
        <ModalBlock 
            onClose={onClickCloseModal} 
            visible={ visibleWord} 
            classes={classes} 
            title={selectedModal ? 'Изменить слово' : 'Добавить слово'}
        >
                <FormControl className={classes.formControl} component='fieldset'>
                    <FormGroup aria-label='position' row>
                    <Formik
                            initialValues={{ 
                                name: selectedModal ? selectedModal.name : '',
                                translate: selectedModal ? selectedModal.translate : '',
                                category: selectedModal || selectedCategory  ? selectedCategory.id : '',
                                language: selectedModal || selectedCategory  ? selectedCategory.language.id : '',
                                image: []
                            }}
                            validationSchema={Schema}
                            onSubmit={(values) => {
                                if(selectedModal){
                                    onEditWord(values, selectedModal.id )
                                }else{
                                    onAddWord(values)
                                }
                            }}
                        >
                        {({
                            values,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            dirty, 
                            isValid,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    type='text'
                                    name='name'
                                    label='Введите слово'
                                    className={classes.pdr}
                                    onChange={handleChange}
                                    value={values.name}
                                    required
                                />
                                <TextField
                                    type='text'
                                    name='translate'
                                    label='Определение'
                                    onChange={handleChange}
                                    value={values.translate}
                                    required
                                />
                                {
                                    <div className={classes.formSelect}>
                                        <FormControl className={classes.formSelectControl}>
                                            <InputLabel>
                                                Выберите Категорию
                                            </InputLabel>
                                            {
                                                !selectedModal && selectedCategory
                                                ? <Select
                                                        name='category'
                                                        value={values.category}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <MenuItem value={selectedCategory.id}>{selectedCategory.name}</MenuItem>
                                                    </Select>
                                                : <Select
                                                        name='category'
                                                        value={values.category}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        {
                                                            categoriesModal.map(item =>  
                                                                <MenuItem 
                                                                    key={item.id} 
                                                                    value={item.id}
                                                                >
                                                                    {item.name}
                                                                </MenuItem>)  
                                                        }
                                                    </Select>
                                            }
                                        </FormControl>
                                        <FormControl className={classes.formSelectControl}>
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
                                                    !selectedModal && selectedCategory
                                                    ? <MenuItem value={selectedCategory.language.id}>{selectedCategory.language.name}</MenuItem>
                                                    : language.map(item => 
                                                        <MenuItem 
                                                            onClick={() => handleClickLanguage(item.id, values)} 
                                                            key={item.id} 
                                                            value={item.id}>
                                                            {item.name}
                                                        </MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </div> 
                                }
                                <input
                                    type='file'
                                    name='image'
                                    label='Введите слово'
                                    className={classes.pdr}
                                    onChange={(e) => handleChange(e.target.files[0])}
                                    value={values.image}
                                    required/>
                                {/* <Paper className={classes.dropzone} variant='outlined' {...getRootProps()}>
                                    {
                                        !values.image 
                                            ? <CloudUpload className={classes.dropzoneIcon}/>
                                            : <img 
                                                src={''}
                                                alt={''}
                                                height={200}
                                                width={200} />
                                    }
                                    <input {...getInputProps()} name='image'/>
                                </Paper> */}
                                {/* <Dropzone onDrop={(files) => {
                                    console.log(files)
                                    setFieldValue('image', values.image.concat(files))
                                }}>
                                    {
                                        ({getRootProps, getInputProps}) => 
                                            (<Paper className={classes.dropzone} variant='outlined' {...getRootProps()}>
                                                {
                                                    !values.image 
                                                        ? <CloudUpload className={classes.dropzoneIcon}/>
                                                        : <img src={''}
                                                            alt={''}
                                                            className="img-thumbnail mt-2"
                                                            height={200}
                                                            width={200} />
                                                }
                                                <input {...getInputProps()} name='image'/>
                                            </Paper>)
                                    }
                                </Dropzone> */}
                                <Button 
                                    style={{marginTop: 20  }} 
                                    color='primary' 
                                    variant="contained" 
                                    type='submit'
                                    disabled={!dirty || !isValid} 
                                    fullWidth >
                                    { selectedModal ? 'Сохранить' : 'Добавить'  }
                                </Button>
                            </form>
                        )}
                        </Formik>
                    </FormGroup>
                </FormControl>
                {
                    isLoading && <LoadingModal />
                }
        </ModalBlock>
    )
}

export default WordModal

import axios from 'axios';
import { useState } from 'react';

import Layout from '../../components/Layout';
import AuthCheck from '../../components/AuthCheck';

import MDBox from '../../components/base/MDBox';
import MDButton from '../../components/base/MDButton';
import MDTypography from "../../components/base/MDTypography";
import MDInput from "../../components/base/MDInput";
import BookModal from '../../components/BookModal';


import Card from "@mui/material/Card";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';


export default function AddReviewPage(props) {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);

    const submitHandler = (event) => {
        event.preventDefault();
        console.log("we made a search")
        console.log(searchText)

        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&maxResults=40`).then(data => {
            console.log(data);
            const result = data.data.items;

            setResults(result);
            console.log(result);
        }).catch(err => console.log(err));
    }

    return (
        <Layout>
            <AuthCheck>
                <Card >
                    <MDBox py={5} px={2} display="flex" >
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={5}>
                                <MDInput
                                    onChange={(event) => setSearchText(event.target.value)}
                                    label="Search by Book Title, Author, or ISBN" size="large" fullWidth={true} />
                            </Grid>
                            <Grid item xs>
                                <MDButton onClick={submitHandler} color='info'>Search</MDButton>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox pt={1} pb={2} px={2}>
                        <MDBox >
                            <ImageList cols={9} rowHeight='auto' variant='masonry'>
                                {results.map((item) => {
                                    let thumbnail = item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail;
                                    let authors = item.volumeInfo && item.volumeInfo.authors;
                                    if (thumbnail !== undefined) {

                                        return <ImageListItem key={item.id} >
                                            <img
                                                src={`${thumbnail}`}
                                                srcSet={`${thumbnail}`}
                                                width='164'
                                                height='164'
                                                alt={item.title}
                                                loading="lazy"
                                            />

                                            <BookModal book={item} />
                                        </ImageListItem>
                                    }
                                })}
                            </ImageList>
                        </MDBox>
                    </MDBox>
                </Card>
            </AuthCheck>
        </Layout>
    )
}
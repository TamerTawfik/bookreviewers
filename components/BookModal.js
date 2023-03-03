import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

// Material Dashboard 2 React components
import MDBox from "./base/MDBox";
import MDTypography from "./base/MDTypography";
import MDButton from "./base/MDButton";


import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore';

import { useMaterialUIController } from "../context";



export default function BookModal({ book }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let thumbnail = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail;
    let authors = book.volumeInfo && book.volumeInfo.authors;

    const saveHandler = async (book) => {
        const uid = auth.currentUser.uid;
        const title = book.volumeInfo.title
        const bookLink = book.selfLink;
        let thumbnail = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail;
        let authors = book.volumeInfo && book.volumeInfo.authors;
        let industryIdentifiers = book.volumeInfo && book.volumeInfo.industryIdentifiers;
        const categories = book.volumeInfo.categories;
        // Ensure slug is URL safe
        const slug = encodeURI(kebabCase(title));
        const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

        // Tip: give all fields a default value here
        const data = {
            title: title,
            slug: slug,
            bookLink: bookLink,
            thumbnail: thumbnail,
            authors: authors,
            categories: categories || '',
            industryIdentifiers: industryIdentifiers || '',
            language: book.volumeInfo.language || '',
            pageCount: book.volumeInfo.pageCount || '',
            publisher: book.volumeInfo.publisher || '',
            publishedDate: book.volumeInfo.publishedDate || '',
            description: book.volumeInfo.description || '',
            uid: uid,
            username: username,
            published: false,
            rate: 0,
            content: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(ref, data);

        toast.success('Book Saved');

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }


    return (
        <MDBox>
            <ImageListItemBar

                actionIcon={
                    <IconButton
                        onClick={handleOpen}
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    >
                        <InfoIcon />
                    </IconButton>
                }
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <MDBox sx={{
                        position: 'absolute',
                        overflow: 'scroll',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%',
                        height: '80%',
                        background: darkMode ? '#202940' : 'white',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} >
                            <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
                                {book.volumeInfo.title}
                            </MDTypography>
                        </MDBox>
                        <div>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} >
                                <img
                                    width='200'
                                    height='264'
                                    src={`${thumbnail}`}
                                    srcSet={`${thumbnail}`}
                                    alt={book.volumeInfo.title}
                                    loading="lazy"

                                />
                            </MDBox>
                            <MDBox py={2}>
                                <MDButton fullWidth color='info' onClick={() => saveHandler(book)}>Save </MDButton >
                            </MDBox>

                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Authors: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{authors}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Categories: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{book.volumeInfo.categories}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Language: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{book.volumeInfo.language}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Page Count: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{book.volumeInfo.pageCount}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    publisher: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{book.volumeInfo.publisher}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Published Date: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{book.volumeInfo.publishedDate}
                                </MDTypography>
                            </MDBox>

                        </div>
                        <MDBox mb={2} lineHeight={1}>
                            <MDTypography variant="button" color="text" fontWeight="light">
                                {book.volumeInfo.description}
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Fade>
            </Modal>
        </MDBox >
    );
}

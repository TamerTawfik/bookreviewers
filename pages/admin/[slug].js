import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import Card from "@mui/material/Card";


import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce, useDocumentData } from 'react-firebase-hooks/firestore';

import Link from '../../lib/Link';
import toast from 'react-hot-toast';

import { Editor } from '@tinymce/tinymce-react';
import Layout from '../../components/Layout';
import MDBox from '../../components/base/MDBox';
import MDButton from '../../components/base/MDButton';
import MDTypography from '../../components/base/MDTypography';

import {
    useMaterialUIController,
} from "../../context";



export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <Layout>
                <PostManager />
            </Layout>
        </AuthCheck>
    );

}

function PostManager() {

    const router = useRouter();
    const { slug } = router.query;
    const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug)
    const [post, loading, error] = useDocumentData(postRef);

    function MyEditor() {
        const [controller] = useMaterialUIController();
        const { darkMode } = controller;
        const editorRef = useRef(null);
        const [value, setValue] = useState(post.rate);
        const [hover, setHover] = useState(-1);
        const [checked, setChecked] = useState(post.published);

        const handleChange = (event) => {
            setChecked(event.target.checked);
        };



        function getLabelText(value) {
            return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
        }

        const labels = {
            0.5: 'Useless',
            1: 'Useless+',
            1.5: 'Poor',
            2: 'Poor+',
            2.5: 'Ok',
            3: 'Ok+',
            3.5: 'Good',
            4: 'Good+',
            4.5: 'Excellent',
            5: 'Excellent+',
        };

        const updatePost = async () => {
            await updateDoc(postRef, {
                content: editorRef.current.getContent(),
                rate: value,
                published: checked,
                updatedAt: serverTimestamp(),
            });


            toast.success('Review updated successfully!');
        };

        return (
            <>
                <Card>
                    <MDBox
                        sx={{
                            width: 200,
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                        }}
                    >
                        <Rating
                            name="hover-feedback"
                            value={value}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        {value !== null && (
                            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                        )}
                    </MDBox>
                    <MDBox >
                        <Editor
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={post.content}
                            init={{
                                height: 500,
                                menubar: false,
                                statusbar: false,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo |   ' +
                                    'bold italic blockquote | alignleft aligncenter ' +
                                    'alignright alignjustify | ' +
                                    'removeformat',
                                skin: darkMode ? 'oxide-dark' : 'oxide',
                                content_css: darkMode ? 'dark' : 'default',
                            }}
                        />
                    </MDBox>
                </Card>
                <MDBox sx={{ p: '20px' }}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />} label="published" />
                    </FormGroup>
                    <Box sx={{ py: 2, }}>
                        <MDButton
                            color='info'
                            onClick={updatePost}
                            startIcon={<SaveIcon />}
                            variant="contained"
                        >
                            Save
                    </MDButton>
                    </Box>
                </MDBox>

            </>
        );
    }




    return (
        <>
            <MDBox pt={6}>
                <Grid container spacing={3}>
                    {error && <strong>Error: {JSON.stringify(error)}</strong>}
                    {loading && <span> Loading...</span>}
                    {post && (
                        <>
                            <Grid container>
                                <MDTypography variant='h4' pl={4}>
                                    {post.title}
                                </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={9}>
                                <MDBox>
                                    <MyEditor />
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={6} lg={3}>
                                <Stack spacing={2}>
                                    <Link href={`/${post.username}/${post.slug}`} target='_blank'>
                                        <MDButton fullWidth color='success' variant="contained" startIcon={<PreviewIcon />}>Live View</MDButton>
                                    </Link>
                                    <DeletePostButton postRef={postRef} />
                                </Stack>
                            </Grid>
                        </>
                    )}

                </Grid>
            </MDBox>

        </>
    );
}



function DeletePostButton({ postRef }) {
    const router = useRouter();

    const deletePost = async () => {
        const doIt = confirm('are you sure!');
        if (doIt) {
            await deleteDoc(postRef);
            router.push('/admin');
            toast('review deleted ', { icon: '🗑️' });
        }
    };

    return (
        <MDButton color='error' variant="contained" startIcon={<DeleteIcon />} onClick={deletePost}>
            Delete
        </MDButton>
    );
}


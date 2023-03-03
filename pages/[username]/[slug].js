import Layout from '../../components/Layout';
import PostContent from '../../components/PostContent';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';
import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';

// @mui material components
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Grid';
import MDBox from '../../components/base/MDBox';
import MDButton from '../../components/base/MDButton';
import MDTypography from '../../components/base/MDTypography';

import Link from '../../lib/Link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';


export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);

        post = postToJSON(await getDoc(postRef));

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 100,
    };
}

export async function getStaticPaths() {
    // Improve my using Admin SDK to select empty docs
    const q = query(
        collectionGroup(getFirestore(), 'posts'),
        limit(20)
    )
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        // must be in this format:
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        fallback: 'blocking',
    };
}


export default function Post(props) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    const { user: currentUser } = useContext(UserContext);

    return (
        <Layout>
            <main >
                <Metatags title={post.title} description={post.title} />
                <MDBox pt={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={5}>
                            <Stack spacing={2}>
                                <img width='148' height='194' src={post.thumbnail} alt={post.title} />
                                <Rating name="size-small" defaultValue={post.rate} readOnly size="large" precision={0.5} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6} lg={7} >
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Authors: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{post.authors}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Categories: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{post.categories}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Language: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{post.language}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Page Count: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{post.pageCount}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    publisher: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{post.publisher}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" py={1} pr={2}>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Published Date: &nbsp;
                                </MDTypography>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{post.publishedDate}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={9}>
                            <section>
                                <PostContent post={post} />
                            </section>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <MDBox pt={6}>
                                <aside >

                                    {currentUser?.uid === post.uid && (
                                        <Link href={`/admin/${post.slug}`}>
                                            <MDButton fullWidth color='primary' variant="contained">Edit Review</MDButton>
                                        </Link>
                                    )}
                                </aside>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </main>
        </Layout>
    );
}
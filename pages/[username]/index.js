import { useState } from 'react';
import { getUserWithUsername, postToJSON, firestore } from '../../lib/firebase';
import { Timestamp, collectionGroup, startAfter, query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';

import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import Metatags from '../../components/Metatags';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import MDButton from '../../components/base/MDButton';
import MDBox from '../../components/base/MDBox';
import MDTypography from '../../components/base/MDTypography';
import Grid from '@mui/material/Grid';

import ProfileCard from '../../components/ProfileCard';

import {
    useMaterialUIController,
    setDarkMode,
} from "../../context";


const LIMIT = 18;


export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;

    const userDoc = await getUserWithUsername(username);

    // If no user, short circuit to 404 page
    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();

        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
        );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
}

export default function UserProfilePage(props) {
    const [controller, dispatch] = useMaterialUIController();
    const { darkMode } = controller;
    const [posts, setPosts] = useState(props.posts);

    return (
        <Layout>
            <main>
                <Metatags title={props.user.username} description={`${props.user.username}'s public profile`} />
                <Header user={props.user} />
                <ProfileCard posts={posts} />
            </main>
        </Layout>
    );
}

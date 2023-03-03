import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore';


import { useCollection } from 'react-firebase-hooks/firestore';

import AddBookModal from '../../components/AddBookModal';
import Layout from '../../components/Layout';
import AdminCard from '../../components/AdminCardList/AdminCard';

import MDBox from '../../components/base/MDBox';
import MDButton from '../../components/base/MDButton';
import AddIcon from '@mui/icons-material/Add';

export default function AdminPostsPage(props) {

    return (
        <Layout>
            <main >
                <AuthCheck>
                    <MDBox py={2}>
                        <MDButton
                            startIcon={<AddIcon />}
                            size='large'
                            color='dark'
                            href='/admin/add-review'>
                            Add Review
        </MDButton>
                    </MDBox>
                    <PostList />
                </AuthCheck>
            </main>
        </Layout>
    );
}



function PostList() {

    const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
    const postQuery = query(ref, orderBy('createdAt', "desc"))

    const [querySnapshot] = useCollection(postQuery);

    const posts = querySnapshot?.docs.map((doc) => doc.data());
    console.log(posts)

    return (
        <>
            <AdminCard posts={posts} admin />

        </>
    );
}


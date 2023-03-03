import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { UserContext } from '../lib/context';
import Metatags from '../components/Metatags';

import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import Layout from '../components/Layout';
import Link from '../lib/Link';

import Grid from '@mui/material/Grid';
import Card from "@mui/material/Card";
import MDButton from '../components/base/MDButton';
import MDBox from '../components/base/MDBox';
import MDInput from '../components/base/MDInput';
import MDAlert from '../components/base/MDAlert';
import MDTypography from '../components/base/MDTypography';
import DashCard from '../components/DashCard';

import {
    useMaterialUIController,
    setDarkMode,
} from "../context";


export default function Enter(props) {
    const [controller, dispatch] = useMaterialUIController();
    const { darkMode } = controller;
    const { user, username } = useContext(UserContext);

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <Layout>
            <main>
                <Metatags title="Enter" description="Sign up for this amazing app!" />
                {/* Need to add if user exists redirect to admin */}
                {user ? !username ? <UsernameForm darkMode={darkMode} /> : <DashBoardCard user={user} username={username} /> : <SignInButton darkMode={darkMode} />}
            </main>
        </Layout>
    );
}

// Sign in with Google button
function SignInButton({ darkMode }) {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
    };

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item sm={6} md={6} lg={4}>
                    <Card sx={{ mt: '50px' }}>
                        <MDBox position="relative" borderRadius="lg" mt={-3} mx={2}>
                            <MDBox
                                component="img"
                                src='/bg.jpg'
                                alt='books'
                                borderRadius="lg"
                                shadow="md"
                                width="100%"
                                height="100%"
                                position="relative"
                                zIndex={1}
                            />
                            <MDBox
                                borderRadius="lg"
                                shadow="md"
                                width="100%"
                                height="100%"
                                position="absolute"
                                left={0}
                                top="3%"
                                sx={{
                                    backgroundImage: `url("/bg.jpg")`,
                                    transform: "scale(0.94)",
                                    filter: "blur(12px)",
                                    backgroundSize: "cover",
                                }}
                            />
                        </MDBox>
                        <MDBox p={3}>
                            <MDTypography display="inline" variant="h3" textTransform="capitalize" fontWeight="bold">
                                Join Us
                </MDTypography>
                            <MDBox mt={2} mb={3}>
                                <MDTypography variant="body2" component="p" color="text">
                                    Platform dedicated for book reviewers.
                    </MDTypography>
                            </MDBox>
                            <MDBox>
                                <MDButton fullWidth variant='outlined' color={darkMode ? 'info' : 'info'} onClick={signInWithGoogle}>
                                    <img src={'/google.png'} width="30px" /> &nbsp;&nbsp; Sign in with Google
                            </MDButton>
                            </MDBox>
                        </MDBox>
                    </Card>

                </Grid>

            </Grid>
            {/* <button onClick={() => signInAnonymously(auth)}>
                Sign in Anonymously
      </button> */}
        </>
    );
}

// Sign out button
function DashBoardCard({ user, username }) {

    return (
        <Grid container justifyContent="center" spacing={2} alignItems="center">
            <Grid container justifyContent="center">
                <MDTypography mb={4} mt={2} variant='h4'>Welcome &nbsp;
                <MDTypography component='span' color='info' variant='h5'>{user.displayName}</MDTypography>
                </MDTypography>
            </Grid>
            <Grid item sm={12} md={4}>
                <DashCard
                    icon="add_circle"
                    title="Add Review"
                    description="Search by Book Title, Author, or ISBN"
                    value="/admin/add-review"
                />
            </Grid>
            <Grid item sm={12} md={4}>
                <DashCard
                    icon="dashboard"
                    title="Manage reviews"
                    description="Edite an exited reviews"
                    value="/admin"
                />
            </Grid>
            <Grid item sm={12} md={4}>
                <DashCard
                    icon="account_balance"
                    title="Visit Profile"
                    description="See your public profile"
                    value={`/${username}`}
                />
            </Grid>
        </Grid>
    )
}

// Username form
function UsernameForm({ darkMode }) {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(getFirestore(), 'users', user.uid);
        const usernameDoc = doc(getFirestore(), 'usernames', formValue);

        // Commit both docs together as a batch write.
        const batch = writeBatch(getFirestore());
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    //

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(getFirestore(), 'usernames', username);
                const snap = await getDoc(ref);
                console.log('Firestore read executed!', snap.exists());
                setIsValid(!snap.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <Grid container justifyContent="center">
                <section>
                    <MDTypography variant='h4' my={2}>

                        Choose Username
                    </MDTypography>
                    <form onSubmit={onSubmit}>
                        <MDInput name="username" placeholder="username" value={formValue} onChange={onChange} />
                        <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                        <MDBox my={2}>
                            <MDButton color={darkMode ? 'success' : 'success'} type="submit" className="btn-green" disabled={!isValid}>
                                Choose
                        </MDButton>
                        </MDBox>
                    </form>
                </section>
            </Grid>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <MDAlert color='white' mt={2}><MDTypography color='white' variant="subtitle2">Checking...</MDTypography></MDAlert>;
    } else if (isValid) {
        return <MDAlert color='success' mt={2}><MDTypography color='white' variant="subtitle2">{username} is available!</MDTypography></MDAlert>;
    } else if (username && !isValid) {
        return <MDAlert color='error' mt={2}><MDTypography color='white' variant="subtitle2"> That username is not available!</MDTypography></MDAlert>;
    } else {
        return <p></p>;
    }
}
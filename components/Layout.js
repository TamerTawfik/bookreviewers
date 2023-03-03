import React from 'react';
import Head from 'next/head';
import Divider from "@mui/material/Divider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "../assets/theme";
import themeDark from "../assets/theme-dark";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MDTypography from './base/MDTypography';
import Footer from './Footer';


import Link from '../lib/Link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';


import {
    useMaterialUIController,
    setDarkMode,
} from "../context";


export default function Layout({ description, title, children }) {
    const [controller, dispatch] = useMaterialUIController();
    const { darkMode } = controller;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, username } = useContext(UserContext);
    const router = useRouter();


    const handleDarkMode = () => setDarkMode(dispatch, !darkMode);
    const signOut = () => {
        auth.signOut();
        router.reload();
    }



    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div>
            <Head>
                <title>{title ? `${title} - Book Reviews ` : 'Book Reviews'}</title>
                {description && <meta name='description' content={description} ></meta>}
            </Head>
            <ThemeProvider theme={darkMode ? themeDark : theme}>
                <CssBaseline />
                <Paper>
                    < AppBar position="static" color={darkMode ? 'dark' : 'white'} sx={{ mb: "50px", }}>
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                <Link href="/enter">Book Reviewers</Link>
                            </Typography>
                            {username ? (
                                <div>

                                    <IconButton sx={{ ml: 1 }} onClick={handleDarkMode} color="inherit">
                                        <MDTypography
                                            sx={{ pr: '4px' }}
                                            variant="caption">
                                            {darkMode ? 'Light Mode ' : 'Dark Mode '}
                                        </MDTypography>
                                        {darkMode ? <Brightness7Icon color="white" /> : <Brightness4Icon color="dark" />}
                                    </IconButton>

                                    <Tooltip title="Open menu">
                                        <IconButton
                                            size="small"
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={handleMenu}
                                            color="inherit"
                                        >
                                            <Avatar sx={{ width: 24, height: 24 }} alt={username} src={user?.photoURL || '/hacker.png'} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <Link href={`/${username}`} >
                                            <MenuItem onClick={handleClose}>
                                                {darkMode ? <AccountBoxIcon sx={{ pr: '6px', width: 24, height: 24 }} color="light" /> : <AccountBoxIcon sx={{ pr: '6px', width: 24, height: 24 }} color="grey" />}

                                                Profile
                                        </MenuItem>
                                        </Link>
                                        <Link href="/admin">
                                            <MenuItem onClick={handleClose}>
                                                {darkMode ? <DashboardIcon sx={{ pr: '6px', width: 24, height: 24 }} color="light" /> : <DashboardIcon sx={{ pr: '6px', width: 24, height: 24 }} color="grey" />}

                                                My account
                                        </MenuItem>
                                        </Link>
                                        {darkMode ? <Divider variant="middle" color="light" /> : <Divider variant="middle" />}
                                        <MenuItem onClick={signOut}>
                                            {darkMode ? <MeetingRoomIcon sx={{ pr: '6px', width: 24, height: 24 }} color="light" /> : <MeetingRoomIcon sx={{ pr: '6px', width: 24, height: 24 }} color="grey" />}
                                        logout
                                    </MenuItem>
                                    </Menu>
                                </div>
                            ) : <div>
                                    <IconButton sx={{ ml: 1 }} onClick={handleDarkMode} color="inherit">
                                        <MDTypography
                                            sx={{ pr: '4px' }}
                                            variant="caption">
                                            {darkMode ? 'Light Mode ' : 'Dark Mode '}
                                        </MDTypography>
                                        {darkMode ? <Brightness7Icon color="white" /> : <Brightness4Icon color="dark" />}
                                    </IconButton>

                                    <Tooltip title="Login">
                                        <IconButton
                                            sx={{ width: 24, height: 24 }}
                                            size="larg"
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            href='/enter'
                                            color="inherit"
                                        >
                                            {darkMode ? <AccountCircle color="white" /> : <AccountCircle color="dark" />}
                                        </IconButton>
                                    </Tooltip>
                                </div>}
                        </Toolbar>
                    </AppBar >
                </Paper>
                <Container sx={{ minHeight: "70vh" }}>
                    {children}
                </Container>
                <footer >
                    <Footer />
                </footer>
            </ThemeProvider>
        </div >
    );
}


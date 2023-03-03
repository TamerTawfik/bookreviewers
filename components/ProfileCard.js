import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Link from '../lib/Link';

import MDBox from "./base/MDBox";
import MDTypography from "./base/MDTypography";



export default function ProfileCard({ posts }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {posts.map((post, index) => (
                    <Grid item xs={2} sm={4} md={2} key={index}>
                        <DefaultInfoCard
                            title={post.title}
                            imgUrl={post.thumbnail}
                            reviewLink={`/${post.username}/${post.slug}`}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}


function DefaultInfoCard({ color, title, reviewLink, imgUrl, }) {
    return (

        <Card>

            <MDBox pt={2} pb={1} px={2} textAlign="center" sx={{ cursor: 'pointer' }}>
                <Link href={reviewLink} >
                    <img width='128' height='194' src={imgUrl} alt={title} />
                </Link>
            </MDBox>
        </Card>

    );
}

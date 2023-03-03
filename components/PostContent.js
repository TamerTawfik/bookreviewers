import Link from '../lib/Link';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import MDBox from './base/MDBox';
import MDTypography from './base/MDTypography';

// UI component for main post content
export default function PostContent({ post }) {
    const createdAt = typeof post.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    const data = post?.content;

    return (
        <MDBox pt={6}>
            <MDTypography variant='h3' color='info'
                textGradient>{post.title}</MDTypography>
            <MDTypography variant="subtitle2" color='secondary'>
                Written by{' '}
                <Link href={`/${post.username}/`}>
                    <MDTypography variant="button" color='info'>@{post.username}</MDTypography>
                </Link>{' '}
        on {createdAt.toISOString()}
            </MDTypography >
            <br />
            <MDTypography variant="body1" dangerouslySetInnerHTML={{ __html: data }}>

            </MDTypography>

        </MDBox>
    );
}
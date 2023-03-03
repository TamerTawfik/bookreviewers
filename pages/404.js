import Link from '../lib/Link';
import Layout from '../components/Layout';

import Grid from '@mui/material/Grid';

import MDBox from "../components/base/MDBox";
import MDTypography from "../components/base/MDTypography";
import MDButton from "../components/base/MDButton";

export default function Custom404() {
    return (
        <Layout>
            <Grid container justifyContent="center" spacing={2} alignItems="center">
                <Grid container justifyContent="center">
                    <Grid item sm={12} md={12}>
                        <MDBox my={2}>
                            <MDTypography variant='h4'>404 - That page does not seem to exist...</MDTypography>
                        </MDBox>
                    </Grid>
                    <Grid item sm={12} md={12}>
                        <MDBox my={2}>
                            <iframe
                                src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
                                width="480"
                                height="362"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </MDBox>
                    </Grid>
                    <Grid item sm={12} md={12}>
                        <MDBox my={2}>
                            <Link href="/enter">
                                <MDButton color='info'>Go home</MDButton>
                            </Link>
                        </MDBox>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
}
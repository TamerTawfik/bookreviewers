/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../base/MDBox";
import MDTypography from "../base/MDTypography";
import MDAvatar from "../base/MDAvatar";


function Header({ user }) {


    return (
        <MDBox position="relative" mb={5}>
            <MDBox
                display="flex"
                alignItems="center"
                position="relative"
                minHeight="13.75rem"
                borderRadius="xl"
                sx={{
                    backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                        `${linearGradient(
                            rgba(gradients.info.main, 0.6),
                            rgba(gradients.info.state, 0.6)
                        )}, url('/bg.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "50%",
                    overflow: "hidden",
                }}
            />
            <Card
                sx={{
                    position: "relative",
                    mt: -8,
                    mx: 3,
                    py: 2,
                    px: 2,
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <MDAvatar src={user.photoURL || '/hacker.png'} alt="profile-image" size="lg" shadow="sm" />
                    </Grid>
                    <Grid item>
                        <MDBox height="100%" mt={0.5} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                {user.displayName}
                            </MDTypography>
                            <MDTypography variant="button" color="text" fontWeight="regular">
                                @{user.username}
                            </MDTypography>
                        </MDBox>
                    </Grid>

                </Grid>
            </Card>
        </MDBox>
    );
}



export default Header;

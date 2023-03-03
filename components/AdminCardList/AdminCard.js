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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import Link from '../../lib/Link';

// @mui material components
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Rating from '@mui/material/Rating';

// Material Dashboard 2 React components
import MDBox from "../base/MDBox";
import MDTypography from "../base/MDTypography";
import MDButton from "../base/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "../../context";

function AdminCard({ posts, admin }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;



    return (
        <Card >
            <MDBox pt={3} px={2}>
                <MDTypography variant="h6" fontWeight="medium">
                    Manage Reviews
                </MDTypography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
                <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    {posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null}
                </MDBox>
            </MDBox>
        </Card>

    );
}

// Setting default values for the props of AdminCard


export default AdminCard;

function PostItem({ post, admin = false }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    // Naive method to calc word count and read time
    // const wordCount = post?.content.trim().split(/\s+/g).length;
    // const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    let noGutter = false;
    return (
        <MDBox
            component="li"
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            bgColor={darkMode ? "transparent" : "grey-100"}
            borderRadius="lg"
            p={3}
            mb={noGutter ? 0 : 1}
            mt={2}
        >
            <MDBox width="100%" display="flex" flexDirection="column">
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    flexDirection={{ xs: "column", sm: "row" }}
                    mb={2}
                >
                    <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                        <Link target='_blank' href={`/${post.username}/${post.slug}`}>
                            {post.title}
                        </Link>
                    </MDTypography>

                    <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                        <MDButton variant="text" color={darkMode ? "white" : "dark"}>
                            <Link href={`/admin/${post.slug}`}>
                                <Icon>edit</Icon>&nbsp;edit
                            </Link>
                        </MDButton>
                    </MDBox>
                </MDBox>
                <MDBox mb={1} lineHeight={0}>
                    <Rating name="size-small" defaultValue={post.rate} readOnly size="small" precision={0.5} />
                </MDBox>

                <MDBox mb={1} lineHeight={0}>
                    <MDTypography variant="caption" color="text">
                        Status:&nbsp;&nbsp;&nbsp;
            <MDTypography color={post.published ? 'success' : 'error'} variant="caption" fontWeight="medium" textTransform="capitalize">
                            {post.published ? "Published" : "Unpublished"}
                        </MDTypography>
                    </MDTypography>
                </MDBox>
                <MDTypography variant="caption" color="text">
                    Created At:&nbsp;&nbsp;&nbsp;
          <MDTypography variant="caption" fontWeight="medium">
                        {createdAt.toISOString()}
                    </MDTypography>
                </MDTypography>
            </MDBox>
        </MDBox>
    );
}
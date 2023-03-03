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

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../base/MDBox";
import MDTypography from "../base/MDTypography";

// Billing page components
import AdminCard from "./AdminCard";

function AdminCardList() {
    return (
        <Card id="delete-account">
            <MDBox pt={3} px={2}>
                <MDTypography variant="h6" fontWeight="medium">
                    Manage Reviews
        </MDTypography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
                <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>

                </MDBox>
            </MDBox>
        </Card>
    );
}

export default AdminCardList;

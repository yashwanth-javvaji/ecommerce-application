// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Head from "next/head";

// Material UI
// Components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// Icons
import PersonIcon from '@mui/icons-material/Person';

// Other Dependencies
import moment from 'moment';

// Custom
// Components
import ComponentHeader from "../../components/ComponentHeader";
// HOCs
import isAuthenticated from '../../HOC/isAuthenticated';
import withCurrentUser from "../../HOC/withCurrentUser";
// Services
import { getProfileImage } from "../../services/profile";


const MyProfile = ({ currentUser }) => {
    const { firstname, lastname, email, roles, createdAt, updatedAt } = currentUser;

    const [profileImage, setProfileImage] = useState();

    useEffect(async () => {
        if (!!currentUser.profileImage) {
            setProfileImage(await getProfileImage(currentUser.profileImage));
        }
    }, [currentUser.profileImage]);

    return (
        <>
            <Head>
                <title>SKY | My Profile</title>
            </Head>
            <Grid container spacing={3}>
                <ComponentHeader
                    icon={PersonIcon}
                    title="My Profile"
                    href="/profile/edit"
                    linkText="Edit Profile"
                />
                <Grid item xs={12}>
                    <Card sx={{ display: { xs: 'block', sm: 'flex' }, alignItems: 'center' }}>
                        {(!!profileImage) && (<CardMedia
                            component="img"
                            height={300}
                            width={300}
                            image={profileImage}
                        />)}
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} mt={1}>
                                    <Typography variant="h4" gutterBottom>
                                        {firstname} {lastname}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">First Name</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{firstname}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Last Name</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{lastname}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Email</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{email}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Roles</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{roles.join(", ")}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Created On</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{moment(createdAt).format('MMMM Do, YYYY, hh:mm:ss a')}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{moment(updatedAt).format('MMMM Do, YYYY, hh:mm:ss a')}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default withCurrentUser(isAuthenticated(MyProfile));
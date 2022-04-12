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
// HOC
import isAuthenticated from '../../HOC/isAuthenticated';
import withCurrentUser from "../../HOC/withCurrentUser";


const MyProfile = ({ currentUser }) => {
    return (
        <Grid container spacing={3}>
            <ComponentHeader
                icon={PersonIcon}
                title="My Profile"
                href="/profile/edit"
                linkText="Edit Profile"
            />
            <Grid item xs={12}>
                <Card sx={{ display: { xs: 'block', sm: 'flex' }, alignItems: 'center' }}>
                    {currentUser.profileImage && (<CardMedia
                        component="img"
                        height={300}
                        width={300}
                        image={currentUser.profileImage}
                    />)}
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} mt={1}>
                                <Typography variant="h4" gutterBottom>
                                    {currentUser.firstname} {currentUser.lastname}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">First Name</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{currentUser.firstname}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Last Name</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{currentUser.lastname}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{currentUser.email}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Roles</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{currentUser.roles.join(", ")}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Created On</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{moment(currentUser.createdAt).format('MMMM Do, YYYY, hh:mm:ss a')}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{moment(currentUser.updatedAt).format('MMMM Do, YYYY, hh:mm:ss a')}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default withCurrentUser(isAuthenticated(MyProfile));
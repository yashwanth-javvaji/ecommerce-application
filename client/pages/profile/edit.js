// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Head from 'next/head';
import Router from 'next/router';

// Material UI
// Components
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
// Icons
import PersonIcon from '@mui/icons-material/Person';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// Custom
// Components
import ComponentHeader from "../../components/ComponentHeader";
// HOCs
import isAuthenticated from '../../HOC/isAuthenticated';
import withCurrentUser from "../../HOC/withCurrentUser";
// Services
import { getProfileImage, updateProfile, uploadProfileImage } from "../../services/profile";
// Utils
import { checkImage, checkIsEmail, checkIsEmpty } from "../../utils/error-handling/validation";
import { formatErrorMessage } from '../../utils/error-handling/format-error-message';


const EditProfile = ({ currentUser }) => {
    const [profileImage, setProfileImage] = useState();
    const [profileImageUrl, setProfileImageUrl] = useState();
    const [formData, setFromData] = useState({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        email: currentUser.email || ""
    });
    const [errors, setErrors] = useState({});

    const validate = (target) => {
        let isError = false;
        const attributes = target ? [target.name] : Object.keys(formData);
        // firstname
        if (attributes.includes("firstname")) {
            const value = target ? target.value : formData.firstname;
            isError |= checkIsEmpty(value, "firstname", errors, setErrors);
        }
        // lastname
        if (attributes.includes("lastname")) {
            const value = target ? target.value : formData.lastname;
            isError |= checkIsEmpty(value, "lastname", errors, setErrors);
        }
        // email
        if (attributes.includes("email")) {
            const value = target ? target.value : formData.email;
            isError |= checkIsEmail(value, "email", errors, setErrors);
        }
        return isError;
    };

    const handleBlur = (event) => {
        validate(event.target);
    };

    const handleChange = (event) => {
        setFromData({
            ...formData,
            [event.target.name]: event.target.value
        });
        validate(event.target);
    };

    const handleProfileImageChange = (event) => {
        if (!checkImage(event.target.files[0], 5, { width: 500, height: 500 }, "profileImage", errors, setErrors)) {
            delete errors.profileImage;
            setErrors(errors);
            setProfileImage(event.target.files[0]);
        } else {
            setProfileImage(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const isError = validate();
        if (!isError) {
            if (profileImage) {
                uploadProfileImage(event.target.profileImage.files[0]);
            }
            updateProfile({
                data: formData,
                onSuccess: () => Router.push("/profile"),
                onError: (errors) => setErrors(formatErrorMessage(errors))
            });
        }
    };

    useEffect(async () => {
        if (!!currentUser.profileImage) {
            setProfileImageUrl(await getProfileImage(currentUser.profileImage));
        }
    }, [currentUser.profileImage]);

    useEffect(() => {
        if (!profileImage) {
            setProfileImageUrl(null);
            return;
        }
        const profileImageUrl = URL.createObjectURL(profileImage)
        setProfileImageUrl(profileImageUrl)
        return () => URL.revokeObjectURL(profileImageUrl)
    }, [profileImage]);

    return (
        <>
            <Head>
                <title>SKY | Edit Profile</title>
            </Head>
            <Grid container spacing={3}>
                <ComponentHeader
                    icon={PersonIcon}
                    title="Edit Profile"
                    href="/profile"
                    linkText="Back to Profile"
                />
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box component="form" id="editProfileForm" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {(!!errors.message) && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{errors.message}</Alert>
                                    </Grid>
                                )}
                                <Grid item container spacing={2} alignItems='center'>
                                    {(!!profileImageUrl) && (
                                        <Grid item>
                                            <Avatar
                                                src={profileImageUrl}
                                                sx={{ width: 56, height: 56 }}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item>
                                        <FormControl required error={!!errors.profileImage}>
                                            <label htmlFor="profileImage">
                                                <input accept="image/*" id="profileImage" name="profileImage" type="file" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                                                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                                                    Upload
                                                </Button>
                                                <FormHelperText>{errors.profileImage}</FormHelperText>
                                            </label>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.firstname}
                                        required
                                        fullWidth
                                        id="firstname"
                                        label="First Name"
                                        name="firstname"
                                        value={formData.firstname}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                        helperText={errors.firstname}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.lastname}
                                        required
                                        fullWidth
                                        id="lastname"
                                        label="Last Name"
                                        name="lastname"
                                        value={formData.lastname}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                        helperText={errors.lastname}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        error={!!errors.email}
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        helperText={errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default withCurrentUser(isAuthenticated(EditProfile));
// ReactJS
import { useState } from 'react';

// NextJS
import Head from 'next/head';
import Router from 'next/router';

// Material UI
// Components
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Custom
// Services
import { signin } from '../../services/auth';
// Utils
import { checkIsEmail, checkIsEmpty } from "../../utils/error-handling/validation";
import { formatErrorMessage } from '../../utils/error-handling/format-error-message';


const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (target) => {
    let isError = false;
    const attributes = target ? [target.name] : Object.keys(formData);
    // email
    if (attributes.includes("email")) {
      const value = target ? target.value : formData.email;
      isError |= checkIsEmail(value, "email", errors, setErrors);
    }
    // password
    if (attributes.includes("password")) {
      const value = target ? target.value : formData.password;
      isError |= checkIsEmpty(value, "password", errors, setErrors);
    }
    return isError;
  };

  const handleBlur = (event) => {
    validate(event.target);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
    validate(event.target);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isError = validate();
    if (!isError) {
      await signin({
        data: formData,
        onSuccess: () => Router.push('/'),
        onError: (errors) => setErrors(formatErrorMessage(errors))
      });
    }
  };

  return (
    <>
      <Head>
        <title>SKY | Sign In</title>
      </Head>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          item
          xs={12}
          sm={9}
          md={6}
          component={Paper}
          elevation={0}
          square
          sx={{
            backgroundColor: 'transparent',
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              m: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {(!!errors.message) && (
                  <Grid item xs={12}>
                    <Alert severity="error">{errors.message}</Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    error={!!errors.email}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete="email"
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    error={!!errors.password}
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete="current-password"
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ mr: 1 }} >
                          <IconButton
                            onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/auth/signup" variant="body2">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default SignIn;
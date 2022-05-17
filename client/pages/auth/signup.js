// ReactJS
import { useEffect, useState } from 'react';

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
// Components
import PasswordStrength from '../../components/auth/PasswordStrength';
// Services
import { signup } from '../../services/auth';
// Utils
import { checkIsEmail, checkPassword, checkIsEmpty, checkLength } from "../../utils/error-handling/validation";
import { formatErrorMessage } from '../../utils/error-handling/format-error-message';
import { validateStrength } from '../../utils/auth/password-strength';


const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Bad",
    color: "grey",
    attributes: {
      "should be atleast 8 characters in length": false,
      "must include numbers": false,
      "must include both lowercase and uppercase letters": false,
      "must include special characters": false
    },
    warning: ""
  });
  const [errors, setErrors] = useState({});

  const validate = (target) => {
    let isError = false;
    const attributes = target ? [target.name] : Object.keys(formData);
    // firstname
    if (attributes.includes("firstname")) {
      const value = target ? target.value : formData.firstname;
      isError |= checkIsEmpty(value, "firstname", errors, setErrors) || checkLength(value, { min: 3 }, "firstname", errors, setErrors);
    }
    // lastname
    if (attributes.includes("lastname")) {
      const value = target ? target.value : formData.lastname;
      isError |= checkIsEmpty(value, "lastname", errors, setErrors) || checkLength(value, { min: 3 }, "lastname", errors, setErrors);
    }
    // email
    if (attributes.includes("email")) {
      const value = target ? target.value : formData.email;
      isError |= checkIsEmail(value, "email", errors, setErrors);
    }
    // password
    if (attributes.includes("password")) {
      const value = target ? target.value : formData.password;
      isError |= checkPassword(value, formData.confirmPassword, "password", errors, setErrors) || checkLength(value, { min: 8 }, "password", errors, setErrors);
    }
    // confirmPassword
    if (attributes.includes("confirmPassword")) {
      const value = target ? target.value : formData.confirmPassword;
      isError |= checkPassword(formData.password, value, "confirmPassword", errors, setErrors);
    }
    return isError;
  }

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const isError = validate();
    if (!isError) {
      signup({
        data: formData,
        onSuccess: () => Router.push('/'),
        onError: (errors) => setErrors(formatErrorMessage(errors))
      });
    }
  };

  useEffect(() => {
    setPasswordStrength(validateStrength(formData.password));
  }, [formData.password]);

  return (
    <>
      <Head>
        <title>SKY | Sign Up</title>
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
              Sign Up
            </Typography>
            <Box component="form" id="signupForm" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {(!!errors.message) && (
                  <Grid item xs={12}>
                    <Alert severity="error">{errors.message}</Alert>
                  </Grid>
                )}
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
                    autoComplete="new-password"
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
                  {formData.password.length !== 0 && <PasswordStrength passwordStrength={passwordStrength} />}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    error={!!errors.confirmPassword}
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ mr: 1 }} >
                          <IconButton
                            onClick={() => setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/auth/signin" variant="body2">
                    Already have an account? Sign in
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

export default SignUp;
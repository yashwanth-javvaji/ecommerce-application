// React
import { useEffect, useState } from 'react';

// Next
import Router from 'next/router';

// Material UI
// Components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

// Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Other Dependencies
import validator from 'validator';

// Custom
// Components
import PasswordStrength from '../components/PasswordStrength';
// Services
import { signup } from '../services/auth';
// Utils
import { addStateAttribute, deleteStateAttribute } from '../utils/use-state';
import { formatErrorMessage } from '../utils/format-error-message';
import { validateStrength } from '../utils/auth/password-strength';


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
      const value = target ? target.value : formData.password;
      if (validator.isEmpty(value)) {
        isError = true;
        addStateAttribute(setErrors, "firstname", "please enter firstname");
      } else {
        deleteStateAttribute(errors, setErrors, "firstname");
      }
    }
    //lastname
    if (attributes.includes("lastname")) {
      const value = target ? target.value : formData.password;
      if (validator.isEmpty(value)) {
        isError = true;
        addStateAttribute(setErrors, "lastname", "please enter lastname");
      } else {
        deleteStateAttribute(errors, setErrors, "lastname");
      }
    }
    // email
    if (attributes.includes("email")) {
      const value = target ? target.value : formData.email;
      if (validator.isEmpty(value)) {
        isError = true;
        addStateAttribute(setErrors, "email", "please enter email");
      } else if (!validator.isEmail(value)) {
        isError = true;
        addStateAttribute(setErrors, "email", "please enter a valid email");
      } else {
        deleteStateAttribute(errors, setErrors, "email");
      }
    }
    // password
    if (attributes.includes("password")) {
      const value = target ? target.value : formData.password;
      if (validator.isEmpty(value)) {
        isError = true;
        addStateAttribute(setErrors, "password", "please enter password");
      } else {
        deleteStateAttribute(errors, setErrors, "password");
        if (!validator.isEmpty(formData.confirmPassword)) {
          if (value !== formData.confirmPassword) {
            isError = true;
            addStateAttribute(setErrors, "confirmPassword", "passwords don't match");
          } else {
            deleteStateAttribute(errors, setErrors, "confirmPassword");
          }
        }
      }
    }
    // confirmPassword
    if (attributes.includes("confirmPassword")) {
      const value = target ? target.value : formData.confirmPassword;
      if (validator.isEmpty(value)) {
        isError = true;
        addStateAttribute(setErrors, "confirmPassword", "please confirm your password");
      } else if (value !== formData.password) {
        isError = true;
        addStateAttribute(setErrors, "confirmPassword", "passwords don't match");
      } else {
        deleteStateAttribute(errors, setErrors, "confirmPassword");
      }
    }
    return isError;
  }

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
    <Grid container component="main" alignItems="center" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          height: '100%',
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
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
              {!!errors.message && (
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
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignUp;
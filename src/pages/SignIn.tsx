import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { apiConfiguration, axiosRequestConfig } from '../App';
import DisplayError from '../components/DisplayError';
import PhoneInput from '../components/PhoneInput';
import { ApiResponse, User, UserApi } from '../model';

type SignInPageProps = {
  onSignInUser: (user: User) => void;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignInPage: React.FC<SignInPageProps> = (props) => {
  const classes = useStyles();
  const [phone, setPhone] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<ApiResponse | undefined>();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userApi = new UserApi(apiConfiguration);

    userApi
      .loginUser({ phone, password }, axiosRequestConfig)
      .then((response) => props.onSignInUser(response.data))
      .catch((error) => setError(error.response.data));
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img alt='Levsha' src='/favicon-57.png' />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Вход
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='phone'
            label='Мобильный телефон'
            name='phone'
            autoComplete='phone'
            autoFocus
            InputProps={{
              inputComponent: PhoneInput as any,
            }}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Пароль'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Войти
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href='#' variant='body2'>
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href='/#/signup' variant='body2'>
                {'Нет аккаунта? Регистрация'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {error ? <DisplayError error={error} /> : null}
    </Container>
  );
};

export default SignInPage;

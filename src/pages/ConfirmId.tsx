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
import { useHistory } from 'react-router-dom';

import { PagePath } from '.';
import { apiConfiguration, axiosRequestConfig } from '../App';
import DisplayError from '../components/DisplayError';
import PhoneInput from '../components/PhoneInput';
import { ApiResponse, User, UserApi } from '../model';

type ConfirmIdPageProps = {
  onConfirmIdUser: (user: User) => void;
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

const ConfirmIdPage: React.FC<ConfirmIdPageProps> = (props) => {
  const classes = useStyles();
  const [idCode, setCode] = React.useState<string>('');
  const [error, setError] = React.useState<ApiResponse | undefined>();
  const history = useHistory();

  const handleCodeCheck = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleCodeSendAgain = () => {};

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img alt='Levsha' src='/favicon-57.png' />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Код из SMS
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleCodeCheck}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='code'
            label='Код из SMS'
            name='code'
            autoComplete='code'
            autoFocus
            value={idCode}
            onChange={(event) => setCode(event.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Проверить
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link onClick={handleCodeSendAgain} variant='body2'>
                Не приходит код? Отправить еще
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {error ? <DisplayError error={error} /> : null}
    </Container>
  );
};

export default ConfirmIdPage;

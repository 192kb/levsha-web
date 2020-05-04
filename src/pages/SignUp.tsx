import React from 'react';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { City, LocationApi } from '../model';
import PhoneInput from '../components/PhoneInput';
import { apiConfiguration } from '../App';

type SignUpPageProps = {};

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const classes = useStyles();
  const [firstName, setFirstName] = React.useState<string>('');
  const [secondName, setSecondName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [city, setCityId] = React.useState<number | ''>('');
  const [password, setPassword] = React.useState<string>('');
  const [cities, setCities] = React.useState<City[]>([]);

  React.useEffect(() => {
    const locationApi = new LocationApi(apiConfiguration);
    locationApi.cityGet().then(({ data }) => setCities(data));
  }, []);

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img alt='Levsha' src='/favicon-57.png' />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Регистрация
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='Имя'
                autoFocus
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                fullWidth
                id='secondname'
                label='Отчетство'
                name='secondName'
                autoComplete='sname'
                value={secondName}
                onChange={(event) => setSecondName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='lastName'
                label='Фамилия'
                name='lastName'
                autoComplete='lname'
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                variant='outlined'
                required
                fullWidth
                id='citySelect'
                label='Город'
                placeholder='Город'
                name='citySelect'
                value={city}
                onChange={(event) =>
                  setCityId(parseInt(event.target.value) || '')
                }
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='phone'
                name='phone'
                autoComplete='phone'
                variant='outlined'
                label='Мобильный телефон'
                InputProps={{
                  inputComponent: PhoneInput as any,
                }}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
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
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Зарегистрироваться
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/#/signin' variant='body2'>
                Уже есть аккаунт? Вход
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUpPage;

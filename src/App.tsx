import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  createMuiTheme,
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { AccountCircle, Home } from '@material-ui/icons';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';

import { Configuration, User, UserApi } from './model';
import { PagePath } from './pages';
import ListingsPage from './pages/listings';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import { storeUserId } from './storage/userId';
import ListingDetails from './pages/listings/ListingDetails';
import { Blank } from './pages/Blank';
import { ListingAdd } from './pages/listings/ListingAdd';
import { red, yellow } from '@material-ui/core/colors';

export const apiConfiguration: Configuration = new Configuration({
  basePath: 'https://levsha.work/levsha-api',
});

export const axiosRequestConfig: AxiosRequestConfig = {
  withCredentials: true,
};

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: yellow[700],
      contrastText: '#000',
    },
    secondary: {
      main: red[700],
      contrastText: '#000',
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const [user, setUser] = React.useState<User | undefined>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);
  const history = useHistory();

  React.useEffect(() => {
    const userApi = new UserApi(apiConfiguration);
    setUserLoaded(false);
    userApi
      .getCurrentUser(axiosRequestConfig)
      .then((response) => {
        setUser(response.data);
        setUserLoaded(true);
      })
      .catch((error) => setUserLoaded(true));
  }, []);

  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignInUser = (user: User) => {
    setUser(user);
    storeUserId(user.uuid);
    setUserLoaded(true);
    history.push(PagePath.Tasks);
  };

  const handleLogout = () => {
    handleClose();

    const userApi = new UserApi(apiConfiguration);
    userApi.logoutUser(axiosRequestConfig).then(() => setUser(undefined));
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position='fixed' elevation={0}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
            onClick={() => history.push(PagePath.Tasks)}
          >
            <Home />
          </IconButton>
          <Typography
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            Левша
          </Typography>
          {isUserLoaded ? (
            user ? (
              <div>
                <IconButton
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  {/* <MenuItem onClick={handleClose}>Мои заказы</MenuItem> */}
                  <MenuItem onClick={handleLogout}>Выход</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button
                color='inherit'
                onClick={() => history.push(PagePath.SignIn)}
              >
                Вход
              </Button>
            )
          ) : null}
        </Toolbar>
      </AppBar>
      <main style={{ paddingTop: '40px' }}>
        <Switch>
          <Route path={PagePath.SignIn}>
            <SignInPage onSignInUser={handleSignInUser} />
          </Route>
          <Route path={PagePath.SignUp}>
            <SignUpPage />
          </Route>
          <Route path={PagePath.Task + ':taskId'}>
            <ListingDetails />
          </Route>
          <Route path={PagePath.CreateTask}>
            <ListingAdd />
          </Route>
          <Route path={PagePath.Tasks}>
            <ListingsPage />
          </Route>
          <Route component={() => <Blank />} />
        </Switch>
      </main>
      <footer />
    </ThemeProvider>
  );
};

export default App;

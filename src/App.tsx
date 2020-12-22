import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { red, yellow } from '@material-ui/core/colors';
import {
  createMuiTheme,
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { AccountCircle, Home } from '@material-ui/icons';
import { AxiosRequestConfig } from 'axios';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { Configuration, User, UserApi } from './model';
import { PagePath } from './pages';
import { Blank } from './pages/Blank';
import ListingsPage from './pages/listings';
import { ListingAdd } from './pages/listings/ListingAdd';
import ListingDetails from './pages/listings/ListingDetails';
import { ListingEdit } from './pages/listings/ListingEdit';
import ListingsPageUser from './pages/listings/ListingsPageUser';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import { storeUserId } from './storage/userId';

export const apiConfiguration: Configuration = new Configuration({
  basePath: 'https://levsha.work/levsha-api',
});

export const axiosRequestConfig: AxiosRequestConfig = {
  withCredentials: true,
};

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
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
    main: {
      fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
      paddingTop: '40px',
      background: 'rgb(237, 237, 237)',
      height: '100%',
    },
    appBar: {
      fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
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
      <AppBar position='fixed' elevation={0} className={classes.appBar}>
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
                  <MenuItem onClick={() => history.push(PagePath.UserTasks)}>
                    Мои задачи
                  </MenuItem>
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
      <main className={classes.main}>
        <Switch>
          <Route path={PagePath.SignIn}>
            <SignInPage onSignInUser={handleSignInUser} />
          </Route>
          <Route path={PagePath.SignUp}>
            <SignUpPage />
          </Route>
          <Route path={PagePath.TaskEdit + ':taskId'}>
            <ListingEdit />
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
          <Route path={PagePath.UserTasks}>
            <ListingsPageUser />
          </Route>
          <Route component={() => <Blank />} />
        </Switch>
      </main>
      <footer />
    </ThemeProvider>
  );
};

export default App;

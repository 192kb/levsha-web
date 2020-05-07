import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';

import { Configuration, User, UserApi } from './model';
import { PagePath } from './pages';
import ListingsPage from './pages/listings';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import { storeUserId } from './storage/userId';

export const apiConfiguration: Configuration = new Configuration({
  basePath: 'https://192kb.ru/levsha-api',
});
export const axiosRequestConfig: AxiosRequestConfig = {
  withCredentials: true,
};

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
    <>
      <AppBar position='relative'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
          >
            <MenuIcon />
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
                  <MenuItem onClick={handleClose}>Мои заказы</MenuItem>
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
      <main>
        <Switch>
          <Route path={PagePath.SignIn}>
            <SignInPage onSignInUser={handleSignInUser} />
          </Route>
          <Route path={PagePath.SignUp}>
            <SignUpPage />
          </Route>
          <Route path={PagePath.Tasks}>
            <ListingsPage />
          </Route>
        </Switch>
      </main>
      <footer />
    </>
  );
};

export default App;

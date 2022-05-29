import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { green, grey, red, yellow } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import {
  createStyles,
  createTheme,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import {
  AccountCircle,
  ArrowBack,
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
  Tune,
  Menu as MenuIcon,
} from '@material-ui/icons';
import { AxiosRequestConfig } from 'axios';
import React from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import { Configuration, User, UserApi } from './model';
import { PagePath } from './pages';
import { Blank } from './pages/Blank';
import ListingsPage from './pages/listings';
import { Filter } from './pages/listings/Filter';
import { ListingAdd } from './pages/listings/ListingAdd';
import ListingDetails from './pages/listings/ListingDetails';
import { ListingEdit } from './pages/listings/ListingEdit';
import ListingsPageUser from './pages/listings/ListingsPageUser';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import { useFilterValues } from './storage/filterValues';
import { storeUserId } from './storage/userId';

export const apiConfiguration: Configuration = new Configuration({
  basePath: 'https://levsha-work.ru/levsha-api',
});

export const axiosRequestConfig: AxiosRequestConfig = {
  withCredentials: true,
};

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: green[500],
      contrastText: 'black',
    },
    secondary: {
      main: red[700],
      contrastText: 'black',
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
    main: {
      fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
      padding: '40px 0',
      background: grey[50],
      minHeight: 'calc(100% - 40px)',
    },
    footer: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
    },
    appBar: {
      fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
      background: grey[50],
    },
    addIcon: {
      padding: 10,
      background: yellow[700],
      borderRadius: '50%',
    },
    createButton: {
      transform: 'translateY(-20px)',
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [filterValues, setFilterValues] = useFilterValues();
  const [user, setUser] = React.useState<User | undefined>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const userApi = new UserApi(apiConfiguration);
    setUserLoaded(false);
    userApi
      .getCurrentUser(axiosRequestConfig)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => setUser(undefined))
      .finally(() => setUserLoaded(true));
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
    navigate(PagePath.Tasks);
  };

  React.useEffect(() => {
    storeUserId(user?.uuid);
  }, [user]);

  const handleLogout = () => {
    storeUserId(undefined);
    handleClose();

    const userApi = new UserApi(apiConfiguration);
    userApi.logoutUser(axiosRequestConfig).then(() => setUser(undefined));
  };

  const filterCount: number =
    (filterValues?.categories?.length || 0) +
    (filterValues?.districts?.length || 0);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position='fixed' elevation={0} className={classes.appBar}>
        <Container maxWidth='md'>
          <Toolbar>
            {(pathname === PagePath.Tasks && (
              <IconButton
                edge='start'
                className={classes.menuButton}
                color='inherit'
                aria-label='menu'
                onClick={() => navigate(PagePath.Filter)}
              >
                {(() => {
                  switch (filterCount) {
                    case 1:
                      return <Filter1 />;

                    case 2:
                      return <Filter2 />;

                    case 3:
                      return <Filter3 />;

                    case 4:
                      return <Filter4 />;

                    case 5:
                      return <Filter5 />;

                    case 6:
                      return <Filter6 />;

                    case 7:
                      return <Filter7 />;

                    case 8:
                      return <Filter8 />;

                    case 9:
                      return <Filter9 />;

                    case 0:
                      return <Tune />;

                    default:
                      return <Filter9Plus />;
                  }
                })()}
              </IconButton>
            )) ||
              (pathname.startsWith(PagePath.Task) && (
                <IconButton
                  edge='start'
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='menu'
                  onClick={() => navigate(-1)}
                >
                  <ArrowBack />
                </IconButton>
              )) || (
                <IconButton
                  edge='start'
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='menu'
                  onClick={() => navigate(PagePath.Tasks)}
                >
                  <MenuIcon />
                </IconButton>
              )}

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
                    <MenuItem onClick={() => navigate(PagePath.UserTasks)}>
                      Мои задания
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Выход</MenuItem>
                  </Menu>
                </div>
              ) : (
                <Button
                  color='inherit'
                  onClick={() => navigate(PagePath.SignIn)}
                >
                  Вход
                </Button>
              )
            ) : null}
          </Toolbar>
        </Container>
      </AppBar>
      <main className={classes.main}>
        <Routes>
          <Route
            path={PagePath.SignIn}
            element={<SignInPage onSignInUser={handleSignInUser} />}
          />
          <Route path={PagePath.SignUp} element={<SignUpPage />} />
          <Route
            path={PagePath.TaskEdit + ':taskId'}
            element={<ListingEdit />}
          />
          <Route
            path={PagePath.Task + ':taskId'}
            element={<ListingDetails />}
          />
          <Route path={PagePath.CreateTask} element={<ListingAdd />} />
          <Route path={PagePath.UserTasks} element={<ListingsPageUser />} />
          <Route
            path={PagePath.Filter}
            element={
              <Filter
                filterValues={filterValues}
                onChangeFilterValues={setFilterValues}
              />
            }
          />
          <Route
            path={PagePath.Tasks}
            element={
              <ListingsPage
                filterValues={filterValues}
                onChangeFilterValues={setFilterValues}
              />
            }
          />
          <Route element={<Blank />} />
        </Routes>
      </main>
      {PagePath.Tasks === pathname && (
        <footer className={classes.footer}>
          <BottomNavigation
            value={pathname}
            showLabels={true}
            onChange={() => navigate(PagePath.CreateTask)}
          >
            <BottomNavigationAction
              label='Создать задание'
              value={PagePath.CreateTask}
              className={classes.createButton}
              icon={<AddIcon className={classes.addIcon} />}
            />
          </BottomNavigation>
        </footer>
      )}
    </ThemeProvider>
  );
};

export default App;

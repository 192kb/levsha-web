import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ListingsPage from './pages/listings';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import { Configuration } from './model';

export const apiConfiguration: Configuration = {
  basePath: 'https://192kb.ru/levsha-api',
};

const App: React.FC = () => {
  return (
    <>
      <AppBar position='relative'>
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap>
            Левша
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Switch>
          <Route path='/signin'>
            <SignInPage />
          </Route>
          <Route path='/signup'>
            <SignUpPage />
          </Route>
          <Route path='/'>
            <ListingsPage />
          </Route>
        </Switch>
      </main>
      <footer />
    </>
  );
};

export default App;

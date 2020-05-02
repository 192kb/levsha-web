import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ListingsPage from './pages/listings';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

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

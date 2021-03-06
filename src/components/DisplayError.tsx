import React from 'react';
import { ApiResponse } from '../model';
import { Snackbar, SnackbarProps } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { AxiosError } from 'axios';

type DisplayErrorProps = {
  error: ApiResponse | AxiosError | Error;
} & SnackbarProps;

const DisplayError: React.FC<DisplayErrorProps> = ({ error, ...others }) => (
  <Snackbar open={true} autoHideDuration={6000} {...others}>
    <MuiAlert severity='error' elevation={6} variant='filled'>
      {error.message}
    </MuiAlert>
  </Snackbar>
);

export default DisplayError;

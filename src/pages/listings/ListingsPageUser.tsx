import { CircularProgress, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AxiosError } from 'axios';
import * as React from 'react';

import { apiConfiguration, axiosRequestConfig } from '../../App';
import DisplayError from '../../components/DisplayError';
import { Task, TaskApi } from '../../model';
import { ListingItem } from './ListingItem';

type ListingsPageUserProps = {};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    margin: 'auto',
  },
}));

const ListingsPageUser: React.FC<ListingsPageUserProps> = (props) => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState<boolean>(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [error, setError] = React.useState<AxiosError | undefined>();

  const loadTasks = () => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi
      .getUserTasks(axiosRequestConfig)
      .then((response) => {
        setTasks(
          response?.data.sort((a, b) =>
            (b.date_start || b.date_created || '').localeCompare(
              a.date_start || a.date_created || ''
            )
          ) || []
        );
      })
      .catch((error) => setError((error as AxiosError).response?.data || error))
      .finally(() => setLoaded(true));
  };

  React.useEffect(loadTasks, []);

  return (
    <>
      <Container maxWidth='md' className={classes.paper}>
        {isLoaded ? (
          <Grid container spacing={4}>
            {tasks.map((item) => (
              <Grid item key={item.uuid} xs={12} sm={6} md={6}>
                <ListingItem item={item} onUpdate={loadTasks} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        )}
      </Container>
      {error ? <DisplayError error={error} /> : null}
    </>
  );
};

export default ListingsPageUser;

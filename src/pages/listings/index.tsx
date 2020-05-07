import { CircularProgress, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';

import { ListingItem } from './ListingItem';
import { apiConfiguration, axiosRequestConfig } from '../../App';
import { TaskApi, Task } from '../../model';

type ListingsPageProps = {};

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

const ListingsPage: React.FC<ListingsPageProps> = (props) => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState<boolean>(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi.getTasks(axiosRequestConfig).then((response) => {
      setTasks(response.data);
      setLoaded(true);
    });
  }, []);

  return (
    <Container maxWidth='md' className={classes.paper}>
      {isLoaded ? (
        <Grid container spacing={4}>
          {tasks.map((item) => (
            <Grid item key={item.uuid} xs={12} sm={6} md={6}>
              <ListingItem item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
    </Container>
  );
};

export default ListingsPage;

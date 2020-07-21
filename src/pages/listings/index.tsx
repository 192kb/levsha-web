import { CircularProgress, Container, Fab, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';

import { PagePath } from '..';
import { apiConfiguration, axiosRequestConfig } from '../../App';
import { Task, TaskApi } from '../../model';
import { ListingItem } from './ListingItem';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();
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
    <>
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
      <Fab onClick={() => history.push(PagePath.CreateTask)} color='primary'>
        <AddIcon />
      </Fab>
    </>
  );
};

export default ListingsPage;

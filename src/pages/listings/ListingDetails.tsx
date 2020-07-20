import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Grid, LinearProgress } from '@material-ui/core';
import { Task, TaskApi } from '../../model';
import { apiConfiguration, axiosRequestConfig } from '../../App';
import { getDateFromNowToRender } from '../../formatter/dateFromNow';

type ListingDetailsProps = {};

export const ListingDetails: React.FC<ListingDetailsProps> = (props) => {
  const { taskId } = useParams();
  const [task, setTask] = React.useState<Task | undefined>();
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi.getTask(taskId, axiosRequestConfig).then((response) => {
      setTask(response.data);
      setLoaded(response.status === 200);
    });
  }, [taskId]);

  return loaded ? (
    <Paper elevation={3}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography variant='subtitle1' color='textSecondary'>
            {getDateFromNowToRender(
              task?.date_start || task?.date_created || ''
            )}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='subtitle1' color='textSecondary'>
            {getDateFromNowToRender(
              task?.date_start || task?.date_created || ''
            )}
          </Typography>
        </Grid>
      </Grid>
      <Typography component='h2' variant='h5'>
        {task?.title || 'Без названия'}
      </Typography>
      <main>
        <Typography variant='body1' paragraph>
          {task?.description}
        </Typography>
      </main>
    </Paper>
  ) : (
    <LinearProgress />
  );
};

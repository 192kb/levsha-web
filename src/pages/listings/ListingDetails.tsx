import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Button,
  GridList,
  GridListTile,
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Task, TaskApi } from '../../model';
import { apiConfiguration, axiosRequestConfig } from '../../App';
import { DateFromNow } from '../../formatter/dateFromNow';
import { Price } from '../../formatter/price';

type ListingDetailsProps = {};

const useStyles = makeStyles((theme) => ({
  oneRowGridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
}));

export const ListingDetails: React.FC<ListingDetailsProps> = (props) => {
  const { taskId } = useParams();
  const classes = useStyles();
  const [task, setTask] = React.useState<Task | undefined>();
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi.getTask(taskId, axiosRequestConfig).then((response) => {
      setTask(response.data);
      setLoaded(response.status === 200);
    });
  }, [taskId]);

  return loaded && task ? (
    <Container component='main' maxWidth='md'>
      <Paper elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography variant='subtitle1' color='textSecondary'>
              {task.district}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' color='textSecondary'>
              <DateFromNow value={task.date_start || task.date_created || ''} />
            </Typography>
          </Grid>
        </Grid>
        <Typography component='h1' variant='h2'>
          {task.title || 'Без названия'}
        </Typography>
        <main>
          <div className={classes.oneRowGridList}>
            <GridList className={classes.gridList} cols={2.5}>
              {task.images?.map((taskImage) => (
                <GridListTile key={taskImage.url}>
                  <img src={taskImage.url} alt={task.title} />
                </GridListTile>
              ))}
            </GridList>
          </div>
          <Typography variant='body1' paragraph>
            {task?.description}
          </Typography>
          <Typography component='h2' variant='h3' color='textPrimary'>
            <Price value={task.price || 0} />
          </Typography>
        </main>
        {task.user?.phone_comfirmed ? (
          <Button
            fullWidth
            variant='contained'
            color='primary'
            href={'tel:' + task.user?.phone}
          >
            Позвонить
          </Button>
        ) : null}
      </Paper>
    </Container>
  ) : (
    <LinearProgress />
  );
};

import * as React from 'react';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import {
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Button,
  GridList,
  GridListTile,
  Container,
  Input,
  Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Task, TaskApi } from '../../model';
import { apiConfiguration, axiosRequestConfig } from '../../App';
import { DateFromNow } from '../../formatter/dateFromNow';
import { Price } from '../../formatter/price';
import Alert from '@material-ui/lab/Alert';

type ListingDetailsProps = {} & RouteComponentProps<{ taskId: string }>;

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
  paper: {
    padding: theme.spacing(8),
  },
  phoneButton: {
    margin: '10px 0',
  },
  copyPhoneInput: {
    textAlign: 'center',
  },
}));

const ListingDetails: React.FC<ListingDetailsProps> = (props) => {
  const { taskId } = useParams<{ taskId: string }>();
  const classes = useStyles();
  const [task, setTask] = React.useState<Task | undefined>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [isPhoneHidden, setPhoneHidden] = React.useState<boolean>(true);
  const [isPhoneCopied, setPhoneCopied] = React.useState<boolean>(false);

  React.useEffect(() => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi.getTask(taskId, axiosRequestConfig).then((response) => {
      switch (response.status) {
        case 200:
      }
      setTask(response.data);
      setLoaded(response.status === 200);
    });
  }, [taskId]);

  const copyPhone = () => {
    const copyElementInput: HTMLElement | null = document.getElementById(
      'show-phone-input'
    );
    if (copyElementInput) {
      (copyElementInput as HTMLInputElement).select();
      (copyElementInput as HTMLInputElement).setSelectionRange(0, 999);

      document.execCommand('copy');
      setPhoneCopied(true);
    }
  };

  return loaded && task ? (
    <>
      <Container component='main' maxWidth='md'>
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='subtitle1' color='textSecondary'>
                {task.district?.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant='subtitle1'
                color='textSecondary'
                align='right'
              >
                <DateFromNow
                  value={task.date_start || task.date_created || ''}
                />
              </Typography>
            </Grid>
          </Grid>
          <Typography component='h1' variant='h2'>
            {task.title || 'Без названия'}
          </Typography>
          <Typography component='h2' variant='h4' color='textPrimary'>
            <Price value={task.price || 0} />
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
          </main>
          {task.user ? (
            <Button
              fullWidth
              className={classes.phoneButton}
              variant='contained'
              color='primary'
              href={'tel:' + task.user?.phone}
            >
              Позвонить
            </Button>
          ) : null}
          {task.user ? (
            isPhoneHidden ? (
              <Button
                fullWidth
                className={classes.phoneButton}
                variant='contained'
                color='secondary'
                onClick={() => setPhoneHidden(false)}
              >
                Показать телефон
              </Button>
            ) : (
              <Input
                id='show-phone-input'
                inputProps={{ className: classes.copyPhoneInput }}
                fullWidth
                value={task.user?.phone}
                onClick={copyPhone}
              />
            )
          ) : null}
        </Paper>
      </Container>

      <Snackbar
        open={isPhoneCopied}
        autoHideDuration={6000}
        onClose={() => setPhoneCopied(false)}
      >
        <Alert onClose={() => setPhoneCopied(false)} severity='success'>
          Скопировано {task.user?.phone}
        </Alert>
      </Snackbar>
    </>
  ) : (
    <LinearProgress />
  );
};

export default withRouter(ListingDetails);

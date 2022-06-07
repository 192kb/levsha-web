import {
  Button,
  Container,
  Grid,
  Input,
  LinearProgress,
  Paper,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import * as React from 'react';
import Carousel from 'react-material-ui-carousel';
import { useNavigate, useParams } from 'react-router-dom';
import { PagePath } from '..';

import { apiConfiguration, axiosRequestConfig } from '../../App';
import { UserPlate } from '../../components/UserPlate';
import { DateFromNow } from '../../formatter/dateFromNow';
import { Price } from '../../formatter/price';
import { Task, TaskApi } from '../../model';
import { getUserIdFromStorage } from '../../storage/userId';

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
  container: {
    padding: '40px 0',
    paddingBlockEnd: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: 25,
    margin: '0 20px',
  },
  phoneButton: {
    background: green[500],
    margin: '10px 0',
    fontSize: 12,
    fontWeight: 300,
    textTransform: 'none',
    color: 'white',
    borderRadius: 10,
  },
  showPhoneButton: {
    margin: '10px 0',
    fontSize: 12,
    fontWeight: 300,
    color: 'white',
    background: grey[400],
    borderRadius: 10,
    textTransform: 'none',
  },
  copyPhoneInput: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  district: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
  },
  title: {
    fontWeight: 500,
    fontSize: 18,
  },
  budget: {
    color: grey[500],
    fontSize: 14,
  },
  price: {
    fontWeight: 300,
    fontSize: 24,
  },
  description: {
    fontSize: 12,
    fontWeight: 300,
  },
  editButton: {
    marginBottom: theme.spacing(1),
    fontSize: 12,
    fontWeight: 300,
    textTransform: 'none',
    color: 'white',
    borderRadius: 10,
  },
  deleteButton: {
    fontSize: 12,
    fontWeight: 300,
    textTransform: 'none',
    color: 'white',
    borderRadius: 10,
  },
  carouselItem: {
    color: 'black',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    opacity: 0.3,
  },
  carouselImage: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  indicatorContainer: {
    transform: 'scale(0.666)',
  },
}));

const ListingDetails: React.FC = (props) => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const classes = useStyles();
  const [task, setTask] = React.useState<Task | undefined>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [isPhoneHidden, setPhoneHidden] = React.useState<boolean>(true);
  const [isPhoneCopied, setPhoneCopied] = React.useState<boolean>(false);
  const userId = getUserIdFromStorage();

  React.useEffect(() => {
    const taskApi = new TaskApi(apiConfiguration);
    taskId &&
      taskApi.getTask(taskId, axiosRequestConfig).then((response) => {
        switch (response.status) {
          case 200:
            setTask(response.data);
            setLoaded(true);
            break;

          default:
            console.info(`status ${response.status} not handled`);
            break;
        }
      });
  }, [taskId]);

  const handleHideTask = React.useCallback(() => {
    if (!taskId) {
      return;
    }

    const taskApi = new TaskApi(apiConfiguration);

    taskApi.deleteTask(taskId).finally(() => navigate(-1));
  }, [navigate, taskId]);

  const copyPhone = () => {
    const copyElementInput: HTMLElement | null =
      document.getElementById('show-phone-input');
    if (copyElementInput) {
      (copyElementInput as HTMLInputElement).select();
      (copyElementInput as HTMLInputElement).setSelectionRange(0, 999);

      document.execCommand('copy');
      setPhoneCopied(true);
    }
  };

  return loaded && task ? (
    <>
      <Container component='main' maxWidth='md' className={classes.container}>
        <Paper elevation={0} className={classes.paper}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography
                variant='subtitle1'
                color='textSecondary'
                className={classes.district}
              >
                {task.district?.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant='subtitle1'
                color='textSecondary'
                align='right'
                className={classes.date}
              >
                <DateFromNow
                  value={task.date_start || task.date_created || ''}
                />
              </Typography>
            </Grid>
          </Grid>
          <Typography component='h1' variant='h2' className={classes.title}>
            {task.title || 'Без названия'}
          </Typography>
          <main>
            <Typography variant='body1' paragraph>
              {task?.description}
            </Typography>
            {task.images?.length ? (
              <Carousel
                stopAutoPlayOnHover
                navButtonsAlwaysInvisible
                animation='slide'
                indicatorContainerProps={{
                  className: classes.indicatorContainer,
                }}
                height={500}
              >
                {task.images?.map(({ url, uuid }) => (
                  <div
                    key={uuid}
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      height: '100%',
                    }}
                  >
                    <img
                      src={url}
                      alt={task.title}
                      className={classes.carouselImage}
                    />
                  </div>
                ))}
              </Carousel>
            ) : null}
          </main>
          <Typography component='div' className={classes.budget}>
            Бюджет
          </Typography>
          <Typography
            component='h2'
            variant='h4'
            color='textPrimary'
            className={classes.price}
          >
            <Price value={task.price || 0} />
          </Typography>
          {task.user && <UserPlate user={task.user} />}
          {task.user?.uuid === userId ? (
            <>
              <Button
                fullWidth
                variant='contained'
                onClick={() => navigate(PagePath.TaskEdit + taskId)}
                className={classes.editButton}
              >
                Редактировать
              </Button>

              {task.is_deleted ? (
                <Button
                  fullWidth
                  variant='contained'
                  disabled
                  className={classes.deleteButton}
                >
                  Удалено
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant='contained'
                  color='secondary'
                  onClick={handleHideTask}
                  className={classes.deleteButton}
                >
                  Удалить
                </Button>
              )}
            </>
          ) : (
            <>
              {task.user && (
                <Button
                  fullWidth
                  className={classes.phoneButton}
                  variant='contained'
                  href={'tel:' + task.user?.phone}
                >
                  Позвонить
                </Button>
              )}
              {task.user && isPhoneHidden ? (
                <Button
                  fullWidth
                  className={classes.showPhoneButton}
                  variant='contained'
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
              )}
            </>
          )}
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

export default ListingDetails;

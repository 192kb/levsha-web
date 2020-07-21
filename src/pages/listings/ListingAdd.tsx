import * as React from 'react';
import {
  Task,
  District,
  TaskCategory,
  TaskApi,
  LocationApi,
  UserApi,
} from '../../model';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Select,
  Snackbar,
  InputLabel,
  Paper,
  Container,
  Typography,
  Button,
} from '@material-ui/core';
import { apiConfiguration, axiosRequestConfig } from '../../App';
import { AxiosError } from 'axios';
import _ from 'lodash';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      maxWidth: 'calc(100% - 48px)',
      minWidth: '25ch',
    },
  },
  paper: {
    padding: theme.spacing(8),
  },
  selectInput: {
    marginBottom: theme.spacing(-2),
  },
}));

export const ListingAdd: React.FC<{}> = () => {
  const classes = useStyles();
  const [task, setTask] = React.useState<Task>({});
  const [error, setError] = React.useState<AxiosError | undefined>();

  const [districts, setDistricts] = React.useState<District[]>([]);
  React.useEffect(() => {
    const userApi = new UserApi(apiConfiguration);
    userApi.getCurrentUser(axiosRequestConfig).then((userResponse) => {
      const locationApi = new LocationApi(apiConfiguration);
      locationApi
        .getDiscrictsByCityId(userResponse.data.city?.id || 1)
        .then((locationResponse) => setDistricts(locationResponse.data));
    });
  }, []);

  const [categories, setCategories] = React.useState<TaskCategory[]>([]);
  React.useEffect(() => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi
      .getTaskCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => setError(error));
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    throw new Error('not implemented');
  };

  return (
    <Container component='main' maxWidth='sm'>
      <Paper elevation={3} className={classes.paper}>
        <Typography component='h1' variant='h3'>
          Новая работа
        </Typography>
        <form className={classes.root} onSubmit={onSubmit}>
          <TextField
            fullWidth
            required
            label='Название'
            id='task-title'
            value={task.title}
            variant='outlined'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({ ...task, title: event.target.value })
            }
          />
          <TextField
            fullWidth
            required
            label='Описание'
            id='task-description'
            value={task.description}
            variant='outlined'
            rows={4}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({ ...task, description: event.target.value })
            }
          />
          <InputLabel id='task-discrtict-label' className={classes.selectInput}>
            Район
          </InputLabel>
          <Select
            value={task.district?.id || 0}
            labelId='task-discrtict-label'
            variant='outlined'
            onChange={(
              event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
              }>
            ) =>
              setTask({
                ...task,
                district: districts.find(
                  (distirct) => distirct.id === event.target.value
                ),
              })
            }
          >
            <option value={0}>Не выбрано</option>
            {districts
              .filter((district) => !district.is_deleted)
              .map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
          </Select>
          <InputLabel id='task-category-label' className={classes.selectInput}>
            Категория
          </InputLabel>
          <Select
            value={task.category?.id || 0}
            labelId='task-category-label'
            variant='outlined'
            onChange={(
              event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
              }>
            ) =>
              setTask({
                ...task,
                category: categories.find(
                  (category) => category.id === event.target.value
                ),
              })
            }
          >
            <option value={0}>Не выбрано</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <TextField
            required
            label='Цена'
            id='task-price'
            value={task.price}
            variant='outlined'
            type='number'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({
                ...task,
                price: isNaN(parseInt(event.target.value))
                  ? undefined
                  : parseInt(event.target.value),
              })
            }
          />
          <Button variant='contained' color='primary'>
            Создать
          </Button>
          <Snackbar
            open={!_.isUndefined(error)}
            autoHideDuration={6000}
            onClose={() => setError(undefined)}
          >
            <Alert onClose={() => setError(undefined)} severity='error'>
              {error?.message}
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </Container>
  );
};

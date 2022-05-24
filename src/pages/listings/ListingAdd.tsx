import {
  Button,
  Container,
  InputLabel,
  Paper,
  Select,
  TextField,
  Typography,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AxiosError } from 'axios';
import * as React from 'react';
import { ImageDropzone } from '../../components/ImagesDropzone';

import { apiConfiguration, axiosRequestConfig } from '../../App';
import {
  District,
  LocationApi,
  Task,
  TaskApi,
  TaskCategory,
  UserApi,
} from '../../model';
import { useHistory } from 'react-router-dom';
import { PagePath } from '..';
import DisplayError from '../../components/DisplayError';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      minWidth: '25ch',
    },
  },
  container: {
    paddingTop: 40,
    paddingBlockEnd: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 25,
  },
  selectInput: {
    marginBottom: theme.spacing(-1),
  },
  imageIcon: {
    verticalAlign: 'text-bottom',
  },
  publishButton: {
    width: '100%',
    background: green[500],
    color: 'white',
    borderRadius: 10,
    textTransform: 'none',
  },
}));

export const ListingAdd: React.FC<{}> = () => {
  const classes = useStyles();
  const history = useHistory();

  const [task, setTask] = React.useState<Task>({});
  const [error, setError] = React.useState<AxiosError | undefined>();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [districts, setDistricts] = React.useState<District[]>([]);

  React.useEffect(() => {
    const userApi = new UserApi(apiConfiguration);
    userApi
      .getCurrentUser(axiosRequestConfig)
      .then((userResponse) => {
        const locationApi = new LocationApi(apiConfiguration);
        locationApi
          .getDiscrictsByCityId(userResponse.data.city?.id || 1)
          .then((locationResponse) => setDistricts(locationResponse.data));
      })
      .catch((error) =>
        setError((error as AxiosError).response?.data || error)
      );
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
    event.preventDefault();
    if (isUploading) {
      return setError(
        new Error('Сначала дождемся загрузки изображений') as AxiosError
      );
    }

    if (task.category?.id) {
    } else {
      return setError(new Error('Нужно указать категорию') as AxiosError);
    }

    const taskApi = new TaskApi(apiConfiguration);
    taskApi
      .addTask(task, axiosRequestConfig)
      .then((response) => history.push(PagePath.Task + response.data?.uuid))
      .catch((error) => setError(error));
  };

  return (
    <Container component='main' maxWidth='sm' className={classes.container}>
      <Paper elevation={0} className={classes.paper}>
        <Typography component='h1' variant='h4'>
          Новое задание
        </Typography>
        <form className={classes.root} onSubmit={onSubmit}>
          <TextField
            fullWidth
            required
            label='Название'
            id='task-title'
            value={task.title || ''}
            variant='outlined'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({ ...task, title: event.target.value })
            }
          />
          <TextField
            fullWidth
            required
            multiline
            label='Описание'
            id='task-description'
            value={task.description || ''}
            variant='outlined'
            minRows={4}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({ ...task, description: event.target.value })
            }
          />
          <InputLabel id='task-district-label' className={classes.selectInput}>
            Район
          </InputLabel>
          <Select
            value={task.district?.id || 0}
            labelId='task-district-label'
            variant='outlined'
            fullWidth
            onChange={(
              event: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
              }>
            ) =>
              setTask({
                ...task,
                district: districts.find(
                  (district) => district.id === event.target.value
                ),
              })
            }
          >
            <MenuItem value={0}>Не выбрано</MenuItem>
            {districts
              .filter((district) => !district.is_deleted)
              .map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
          </Select>
          <InputLabel id='task-category-label' className={classes.selectInput}>
            Категория
          </InputLabel>
          <Select
            value={task.category?.id || 0}
            labelId='task-category-label'
            variant='outlined'
            fullWidth
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
            <MenuItem value={0}>Не выбрано</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            required
            label='Цена'
            id='task-price'
            value={task.price || ''}
            variant='outlined'
            type='number'
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({
                ...task,
                price: isNaN(parseInt(event.target.value))
                  ? undefined
                  : parseInt(event.target.value),
              })
            }
          />
          <ImageDropzone
            onFinishedUpload={() => setIsUploading(false)}
            onStartUpload={() => setIsUploading(true)}
            onFileArrayChange={(images) =>
              setTask({
                ...task,
                images,
              })
            }
          />
          <Button
            variant='contained'
            disabled={isUploading}
            type='submit'
            className={classes.publishButton}
          >
            Опубликовать
          </Button>
          {error ? <DisplayError error={error} /> : null}
        </form>
      </Paper>
    </Container>
  );
};

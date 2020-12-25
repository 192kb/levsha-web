import {
  Button,
  Container,
  InputLabel,
  Paper,
  Select,
  TextField,
  Typography,
  MenuItem,
  GridList,
  GridListTile,
  IconButton,
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
import { useHistory, useParams } from 'react-router-dom';
import { PagePath } from '..';
import DisplayError from '../../components/DisplayError';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      // maxWidth: 'calc(100% - 48px)',
      minWidth: '25ch',
    },
  },
  container: {
    paddingTop: '40px',
    paddingBlockEnd: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: '30px',
  },
  selectInput: {
    marginBottom: theme.spacing(-2),
  },
  imageIcon: {
    verticalAlign: 'text-bottom',
  },
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
  removeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}));

export const ListingEdit: React.FC<{}> = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const classes = useStyles();
  const history = useHistory();

  const [task, setTask] = React.useState<Task>({});
  const [loaded, setLoaded] = React.useState<boolean>(false);
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
      .catch((error) => {
        history.push(PagePath.SignIn);
        setError((error as AxiosError).response?.data || error);
      });
  }, [history]);

  React.useEffect(() => {
    setLoaded(false);
    const taskApi = new TaskApi(apiConfiguration);
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
      .updateTask(taskId, task, axiosRequestConfig)
      .then((response) => history.push(PagePath.Task + response.data?.uuid))
      .catch((error) => setError(error));
  };

  return loaded && task ? (
    <Container component='main' maxWidth='sm' className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <Typography component='h1' variant='h4'>
          Редактирование
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
                  (distirct) => distirct.id === event.target.value
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTask({
                ...task,
                price: isNaN(parseInt(event.target.value))
                  ? undefined
                  : parseInt(event.target.value),
              })
            }
          />
          <div className={classes.oneRowGridList}>
            {task.images?.length ? (
              <GridList className={classes.gridList} cols={2.5}>
                {task.images?.map(({ url, uuid }) => (
                  <GridListTile key={uuid}>
                    <IconButton
                      className={classes.removeImage}
                      onClick={() =>
                        setTask({
                          ...task,
                          images: task.images?.filter(
                            (taskImage) => taskImage.uuid !== uuid
                          ),
                        })
                      }
                    >
                      <Close />
                    </IconButton>
                    <img src={url} alt={task.title} />
                  </GridListTile>
                ))}
              </GridList>
            ) : null}
          </div>
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
            color='primary'
            disabled={isUploading}
            type='submit'
            fullWidth
          >
            Готово
          </Button>
          <Button
            variant='contained'
            color='default'
            fullWidth
            onClick={() => history.goBack()}
          >
            Отмена
          </Button>
          {error ? <DisplayError error={error} /> : null}
        </form>
      </Paper>
    </Container>
  ) : null;
};

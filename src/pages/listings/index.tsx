import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AxiosError } from 'axios';
import * as React from 'react';

import { apiConfiguration, axiosRequestConfig } from '../../App';
import DisplayError from '../../components/DisplayError';
import { Task, TaskApi } from '../../model';
import { FilterValues } from './Filter';
import { ListingItem } from './ListingItem';

type ListingsPageProps = {
  filterValues: FilterValues | undefined;
  onChangeFilterValues: (filterValues: FilterValues | undefined) => void;
};

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
  fab: {
    position: 'fixed',
    bottom: '2em',
    right: '2em',
  },
  nothingFound: {
    textAlign: 'center',
    margin: '40px auto 0',
    padding: theme.spacing(10),
  },
  resetFilters: {
    margin: theme.spacing(3),
  },
}));

const ListingsPage: React.FC<ListingsPageProps> = (props) => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState<boolean>(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [error, setError] = React.useState<AxiosError | undefined>();

  const loadTasks = () => {
    const taskApi = new TaskApi(apiConfiguration);
    taskApi
      .getTasks(axiosRequestConfig)
      .then((response) => {
        setTasks(
          response?.data.sort((a, b) =>
            (b.date_start || b.date_created || '').localeCompare(
              a.date_start || a.date_created || ''
            )
          ) || []
        );
      })
      .catch((error) => {
        setError((error as AxiosError).response?.data || error);
        setTasks([]);
      })
      .finally(() => setLoaded(true));
  };

  React.useEffect(loadTasks, []);

  const filteredTasks = tasks
    .filter((item) =>
      props.filterValues?.categories
        ? item.category?.id &&
          props.filterValues?.categories?.includes(item.category?.id)
        : true
    )
    .filter((item) =>
      props.filterValues?.districts
        ? item.district?.id &&
          props.filterValues?.districts?.includes(item.district?.id)
        : true
    );

  return (
    <>
      <Container maxWidth='md' className={classes.paper}>
        {isLoaded ? (
          <Grid container spacing={4}>
            {filteredTasks.length === 0 &&
            ((props.filterValues?.categories &&
              props.filterValues.categories.length > 0) ||
              (props.filterValues?.districts &&
                props.filterValues.districts.length > 0)) ? (
              <Paper className={classes.nothingFound}>
                <Typography variant='h4'>Ничего не найдено</Typography>
                <Button
                  variant='contained'
                  color='default'
                  className={classes.resetFilters}
                  onClick={() => props.onChangeFilterValues(undefined)}
                >
                  Сбросить фильтры
                </Button>
              </Paper>
            ) : (
              filteredTasks.map((item) => (
                <Grid item key={item.uuid} xs={12} sm={6} md={6}>
                  <ListingItem item={item} onUpdate={loadTasks} />
                </Grid>
              ))
            )}
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

export default ListingsPage;

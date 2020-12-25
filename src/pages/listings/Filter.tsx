import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { apiConfiguration } from '../../App';
import DisplayError from '../../components/DisplayError';
import {
  City,
  District,
  LocationApi,
  TaskApi,
  TaskCategory,
} from '../../model';
import { defaultCity } from '../../storage/filterValues';

export type FilterValues = {
  city?: number;
  districts?: number[];
  categories?: number[];
};

type FilterProps = {
  filterValues: FilterValues | undefined;
  onChangeFilterValues: (filterValues: FilterValues | undefined) => void;
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      maxWidth: 'calc(100% - 48px)',
      minWidth: '25ch',
    },
  },
  container: {
    paddingTop: '40px',
    paddingBlockEnd: theme.spacing(2),
  },
  filterButtons: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export const Filter: React.FC<FilterProps> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = React.useState<AxiosError | undefined>();
  const [isLoadingCities, setLoadingCities] = React.useState(false);
  const [isLoadingDistricts, setLoadingDistricts] = React.useState(false);
  const [isLoadingCategories, setLoadingCategories] = React.useState(false);

  const [cities, setCities] = React.useState<City[]>([]);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [categories, setCategories] = React.useState<TaskCategory[]>([]);

  const loadCities = () => {
    setLoadingCities(true);
    const locationApi = new LocationApi(apiConfiguration);
    locationApi
      .getCity()
      .then((response) =>
        response?.data ? setCities(response.data) : setCities([])
      )
      .catch((error) => setError(error.response.data))
      .finally(() => setLoadingCities(false));
  };

  const loadCategories = () => {
    setLoadingCategories(true);
    const taskApi = new TaskApi(apiConfiguration);
    taskApi
      .getTaskCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => setError(error))
      .finally(() => setLoadingCategories(false));
  };

  const loadLocations = () => {
    setLoadingDistricts(true);
    const locationApi = new LocationApi(apiConfiguration);
    locationApi
      .getDiscrictsByCityId(props.filterValues?.city || defaultCity)
      .then((locationResponse) => setDistricts(locationResponse.data))
      .finally(() => setLoadingDistricts(false));
  };

  React.useEffect(loadCities, []);

  React.useEffect(loadLocations, [props.filterValues?.city]);

  React.useEffect(loadCategories, []);
  return (
    <Container component='main' maxWidth='sm' className={classes.container}>
      <Typography component='h1' variant='h3'>
        Фильтры
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            disabled={isLoadingCities}
            select
            required
            fullWidth
            id='citySelect'
            label='Город'
            placeholder='Город'
            name='citySelect'
            value={props.filterValues?.city}
            onChange={(event) =>
              props.onChangeFilterValues({
                ...(props.filterValues || {}),
                city: parseInt(event.target.value) || 0,
              })
            }
          >
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id='task-discrtict-label'>Район</InputLabel>
            <Select
              disabled={isLoadingDistricts && districts.length > 0}
              value={
                props.filterValues?.districts
                  ? props.filterValues?.districts
                  : []
              }
              labelId='task-discrtict-label'
              multiple
              renderValue={(selected) => {
                if ((selected as number[]).length === 0) {
                  return <em>Не выбрано</em>;
                }

                return (selected as number[])
                  .map(
                    (item) =>
                      districts.find((district) => district.id === item)?.name
                  )
                  .join(', ');
              }}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
                }>
              ) =>
                props.onChangeFilterValues({
                  ...props.filterValues,
                  districts: (event.target.value as number[]).filter(
                    (item) => item
                  ),
                })
              }
            >
              {districts.length > 0 ? (
                districts
                  .filter((district) => !district.is_deleted)
                  .map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem key={0}>Выберите город</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id='task-category-label'>Категория</InputLabel>
            <Select
              disabled={isLoadingCategories}
              value={props.filterValues?.categories || []}
              labelId='task-category-label'
              multiple
              fullWidth
              renderValue={(selected) => {
                if ((selected as number[]).length === 0) {
                  return <em>Не выбрано</em>;
                }

                return (selected as number[])
                  .map(
                    (item) =>
                      categories.find((category) => category.id === item)?.name
                  )
                  .join(', ');
              }}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
                }>
              ) =>
                props.onChangeFilterValues({
                  ...props.filterValues,
                  categories: (event.target.value as number[]).filter(
                    (item) => item
                  ),
                })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        variant='contained'
        color='primary'
        onClick={() => history.goBack()}
        className={classes.filterButtons}
      >
        Применить
      </Button>
      <Button
        variant='contained'
        color='default'
        className={classes.filterButtons}
        onClick={() => props.onChangeFilterValues(undefined)}
      >
        Сброс
      </Button>
      {error ? <DisplayError error={error} /> : null}
    </Container>
  );
};

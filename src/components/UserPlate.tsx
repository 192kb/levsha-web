import { Avatar, Typography } from '@material-ui/core';
import { grey, yellow } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';

import { apiConfiguration } from '../App';
import { City, LocationApi, User } from '../model';

type UserPlateProps = {
  user: User;
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: yellow[700],
    float: 'left',
    margin: theme.spacing(1),
    marginLeft: 0,
  },
  cityName: {
    color: grey[400],
    fontSize: '14px',
    lineHeight: '1',
  },
}));

export const UserPlate: React.FC<UserPlateProps> = (props) => {
  const classes = useStyles();
  const [isLoadingCities, setLoadingCities] = React.useState(false);

  const [cities, setCities] = React.useState<City[]>([]);
  const loadCities = () => {
    setLoadingCities(true);
    const locationApi = new LocationApi(apiConfiguration);
    locationApi
      .getCity()
      .then((response) =>
        response?.data ? setCities(response.data) : setCities([])
      )
      .finally(() => setLoadingCities(false));
  };

  React.useEffect(loadCities, [props.user]);

  return (
    <aside>
      <Avatar className={classes.avatar}>{props.user.firstname[0]}</Avatar>
      <Typography variant='h5'>{props.user.firstname}</Typography>
      {isLoadingCities ? (
        <Skeleton variant='text' />
      ) : (
        <Typography className={classes.cityName}>
          {cities.find((city) => city.id === (props.user as any).city_id)?.name}
        </Typography>
      )}
    </aside>
  );
};

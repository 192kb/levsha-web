import { CircularProgress, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import * as React from 'react';

import { Listing, ListingItem } from './ListingItem';

type ListingsPageProps = {};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
  },
}));

const ListingsPage: React.FC<ListingsPageProps> = (props) => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Listing[]>([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () =>
    setTimeout(() => {
      setData([
        {
          image: 'https://source.unsplash.com/random',
          title: 'Отремонтировать телевизор',
          price: 5000,
          location: {
            city: 'Бийск',
            district: 'Детский мир',
          },
          date: moment().subtract(3, 'days').toISOString(),
        },
      ]);
      setLoaded(true);
    }, 3000);

  return (
    <Container maxWidth='md' className={classes.paper}>
      <Grid container spacing={4}>
        {isLoaded ? (
          data.map((item) => (
            <Grid item key={item.date} xs={12} sm={6} md={6}>
              <ListingItem item={item} />
            </Grid>
          ))
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Container>
  );
};

export default ListingsPage;

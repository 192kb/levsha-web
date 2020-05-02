import * as React from 'react';
import { ListingItem, Listing } from './ListingItem';
import moment from 'moment';
import { Grid, Container, CircularProgress } from '@material-ui/core';

type ListingsPageProps = {};

const ListingsPage: React.FC<ListingsPageProps> = (props) => {
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
    <Container maxWidth='md'>
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

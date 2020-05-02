// @flow
import * as React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { getPriceToRender } from '../../formatter/price';

export type ListingLocation = {
  city: string;
  district: string;
};

export type Listing = {
  image: string;
  title: string;
  price: number;
  location: ListingLocation;
  date: string;
};

type ListingItemProps = {
  item: Listing;
};

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
export const ListingItem: React.FC<ListingItemProps> = ({
  item: {
    image,
    title,
    price,
    location: { district },
    date,
  },
}) => {
  const classes = useStyles();
  return (
    <Card>
      <CardMedia className={classes.cardMedia} image={image} title={title} />
      <CardContent>
        <Typography gutterBottom variant='h5' component='h2'>
          {title}
        </Typography>
        <Typography>{getPriceToRender(price)}</Typography>
        <Typography>{district}</Typography>
        <Typography>{moment(date).fromNow()}</Typography>
      </CardContent>
      <CardActions>
        <Button size='small' color='primary'>
          Просмотреть
        </Button>
        <Button size='small' color='primary'>
          Редактировать
        </Button>
      </CardActions>
    </Card>
  );
};

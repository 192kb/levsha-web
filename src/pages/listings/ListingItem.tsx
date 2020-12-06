// @flow
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { PagePath } from '..';
import { DateFromNow } from '../../formatter/dateFromNow';
import { Price } from '../../formatter/price';
import { Task } from '../../model';
import taskDefaultImage from '../../static/task-image-default.png';
import { getUserIdFromStorage } from '../../storage/userId';

export type ListingLocation = {
  city: string;
  district: string;
};

type ListingItemProps = {
  item: Task;
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
    borderRadius: 20,
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  district: {
    float: 'left',
    color: 'gray',
  },
  date: {
    float: 'right',
    color: 'gray',
  },
  budget: {
    color: 'gray',
  },
  price: {
    color: 'black',
    fontWeight: 700,
  },
}));
export const ListingItem: React.FC<ListingItemProps> = ({
  item: {
    uuid,
    images,
    title,
    price,
    district,
    date_start,
    date_created,
    user,
  },
}) => {
  const classes = useStyles();
  const history = useHistory();

  const userId = getUserIdFromStorage();

  return (
    <Card elevation={15} className={classes.card}>
      <CardContent>
        <Typography className={classes.district}>{district?.name}</Typography>
        <Typography className={classes.date}>
          <DateFromNow value={date_start || date_created || ''} />
        </Typography>
      </CardContent>
      <CardMedia
        className={classes.cardMedia}
        image={(images && images[0] && images[0].url) || taskDefaultImage}
        title={title}
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant='h5' component='h2' noWrap>
          {title}
        </Typography>
        {price && (
          <Typography className={classes.budget}>
            Бюджет
            <Typography className={classes.price}>
              <Price value={price} />
            </Typography>
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size='small'
          color='primary'
          onClick={() => history.push(PagePath.Task + uuid)}
        >
          Просмотреть
        </Button>
        {user?.uuid === userId && (
          <Button
            size='small'
            color='secondary'
            onClick={() => history.push(PagePath.TaskEdit + uuid)}
          >
            Редактировать
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

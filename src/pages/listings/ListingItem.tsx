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

import { getPriceToRender } from '../../formatter/price';
import { Task } from '../../model';
import { getUserIdFromStorage } from '../../storage/userId';
import { useHistory } from 'react-router-dom';
import { PagePath } from '..';
import { getDateFromNowToRender } from '../../formatter/dateFromNow';

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
    <Card>
      <CardMedia
        className={classes.cardMedia}
        image={images && images[0] && images[0].url}
        title={title}
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant='h5' component='h2' noWrap>
          {title}
        </Typography>
        {price && (
          <Typography variant='h4' component='h2'>
            {getPriceToRender(price)}
          </Typography>
        )}
        <Typography>{district?.name}</Typography>
        <Typography>
          {getDateFromNowToRender(date_start || date_created || '')}
        </Typography>
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
            color='primary'
            onClick={() => history.push(PagePath.TaskEdit + uuid)}
          >
            Редактировать
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

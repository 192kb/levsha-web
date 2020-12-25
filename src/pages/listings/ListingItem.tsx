import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { PagePath } from '..';
import { apiConfiguration } from '../../App';
import { DateFromNow } from '../../formatter/dateFromNow';
import { Price } from '../../formatter/price';
import { Task, TaskApi } from '../../model';
import { getUserIdFromStorage } from '../../storage/userId';

export type ListingLocation = {
  city: string;
  district: string;
};

type ListingItemProps = {
  item: Task;
  onUpdate: () => void;
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(0),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  district: {
    float: 'left',
    color: 'gray',
    fontSize: '10pt',
  },
  date: {
    float: 'right',
    color: 'gray',
    fontSize: '10pt',
  },
  budget: {
    color: 'gray',
  },
  price: {
    color: 'black',
    fontWeight: 500,
  },
  title: {
    fontSize: '18pt',
    fontWeight: 500,
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
    is_deleted,
  },
  onUpdate,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const userId = getUserIdFromStorage();

  const handleHideTask = () => {
    if (!uuid) {
      return;
    }

    const taskApi = new TaskApi(apiConfiguration);

    taskApi.deleteTask(uuid).finally(onUpdate);
  };

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent>
        <Typography className={classes.district}>{district?.name}</Typography>
        <Typography className={classes.date}>
          <DateFromNow value={date_start || date_created || ''} />
        </Typography>
      </CardContent>
      <CardContent
        className={classes.cardContent}
        onClick={() => history.push(PagePath.Task + uuid)}
      >
        <Typography
          gutterBottom
          noWrap
          component='h3'
          className={classes.title}
        >
          {title}
        </Typography>
        {price && (
          <>
            <Typography component='div' className={classes.budget}>
              Бюджет
            </Typography>

            <Typography component='div' className={classes.price}>
              <Price value={price} />
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        {user?.uuid === userId && (
          <>
            <Button
              size='small'
              onClick={() => history.push(PagePath.TaskEdit + uuid)}
            >
              Редактировать
            </Button>

            {is_deleted ? (
              <Button size='small' disabled>
                Удалено
              </Button>
            ) : (
              <Button size='small' color='secondary' onClick={handleHideTask}>
                Удалить
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};

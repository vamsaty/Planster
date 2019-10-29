import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function SmallChips() {
  const classes = useStyles();

  const handleDelete = () => {
    alert('You clicked the delete icon.');
  };

  const handleClick = () => {
    alert('You clicked the Chip.');
  };

  return (
      <div>
    <Typography>Tags</Typography><br/>
    <div className={classes.root}>
      
      <div><hr/></div>
      <Chip size="small" label="Tag1" onDelete={handleDelete} color="primary" />
      <Chip size="small" label="Tag2" onDelete={handleDelete} color="secondary" />
      <Chip size="small" label="Tag3" onDelete={handleDelete} color="primary" />
      <Chip size="small" label="Tag4" onDelete={handleDelete}  />
      <Chip size="small" label="Tag5" onDelete={handleDelete} color="primary" />
      
    </div>
    </div>
  );
}

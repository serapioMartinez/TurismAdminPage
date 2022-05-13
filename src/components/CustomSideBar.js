import React from 'react';
import { makeStyles } from '@material-ui/core';
import { 
    List, 
    ListItem,
    ListItemText,
    ListItemIcon
} from '@material-ui/core';
import LandscapeIcon from '@material-ui/icons/Landscape';

const styles = makeStyles({
    texto: {
        fontSize: "1.6rem"
    },
    icon: {
        marginRight: "1rem"
    }
})

function CustomSideBar({items}) {
    const classes = styles();
  return (
      <div className='sidebar'>
          <LandscapeIcon className={classes.icon} style={{fontSize: "50px", color: "white"}}/>
          <List disablePadding dense >
          {items.map(({ label, name, ...rest }) => (
          <ListItem key={name} button {...rest} >
            <LandscapeIcon className={classes.icon} style={{fontSize: "50px", color: "white"}}/>
            <ListItemText className={classes.texto} style={{fontSize: "50px",}}><span className={classes.texto}>{label}</span></ListItemText>
          </ListItem>
        ))}
          </List>
      </div>
  )
}

export default CustomSideBar;
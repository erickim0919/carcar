import React from 'react'
import {NavLink} from 'react-router-dom'
import BugReportIcon from '@material-ui/icons/BugReport';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton'
import {makeStyles} from '@material-ui/core/styles';
import {List, ListItem, ListItemText, Divider, Drawer, ListItemAvatar, Avatar} from '@material-ui/core'
import { useCookies } from "react-cookie";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(
    {
        root: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
            height: 48,
            padding: '0 30px'
        }
    }
);



function MaterialInfoDrawer() {
    const classes = useStyles();
    // the drawer opens from the left
    const [state, setState] = React.useState({
        left: false,
      });
    // looks to see whether the user presses certain keys (mainly for UX)
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
          }
      
          setState({ ...state, [anchor]: open });
    } 

    const routes = ["/", "/profile", "/about"]
    const icons = [<DriveEtaIcon/>, <AccountCircleIcon/>, <InfoIcon/>]
    const [cookies, setCookie, removeCookie] = useCookies(['username', 'id']);

    const topics = (anchor) => (
        <div role={"presentation"}
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}>
            {/* Just maps out the topics, making listitems for each one */}
            <List>
            {['Introduction', 'Profile', 'About'].map((text, index) => (
                <>
                <ListItem button key={index}>
                    {text == 'Profile' && typeof cookies.id == "undefined" ? null : <NavLink key={index} to={routes[index]} >
                    <ListItemAvatar key={index}>
                    <Avatar key={index}>
                        {icons[index]}
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText key={index}primary={text} ></ListItemText>
                    </NavLink>}
                </ListItem>
                <Divider />
                </>
            ))}
            </List>
        </div>
    )
    return (
        <div>
            <IconButton edge='start' onClick={toggleDrawer("left", true)} className={classes.root}>
                <MenuIcon/>
            </IconButton> 
            <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
                {topics("left")}
            </Drawer>
        </div>
    )
}

export default MaterialInfoDrawer;

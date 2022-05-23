import { ListItemIcon, ListItemText, makeStyles, Menu, MenuItem } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/styles';
import {  useState } from 'react';
import logo from '../logoOaxaca.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const styles = makeStyles({
    wrapper : {
        boxSizing: "border-box" ,
        position: "fixed",
        top: "0",
        zIndex: "1",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "6rem",
        margin: "0",
        backgroundColor: "black",
        color: "white",
        padding: "0.5rem",
        paddingLeft: "6rem",
        paddingRight: "2rem"
        
    },
    logo : {
        height: "95%"
    },
    userIcon :{
        fontSize: 60,
        color: "white"
    }
    
});

const StyledMenu = withStyles({
    paper:{
        border: '1px solid #d3d4d5'
    }
})((props) =>(
    <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
    }}
    transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
    }}
    {...props}
    />
));

const StyledMenuItem = withStyles(() => ({
    root: {
      '&:focus': {
        backgroundColor: "black",
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: "white",
        },
      },
    },
  }))(MenuItem);
export default function Header(){
    const classes = styles();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) =>{
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleCloseSession = () => {
        console.log("Cerrando sesion")
        console.log(cookies.getAll())
        cookies.remove('username',{ path: '/' });
        cookies.remove('password',{ path: '/' });
        cookies.remove('userId',{ path: '/' });
        if(cookies.get('userType')=="CIUDAD") cookies.remove('ciudadId',{ path: '/' });
        else cookies.remove('establecimientoId',{ path: '/' });
        cookies.remove('userType',{ path: '/' });
        const all = cookies.getAll();
        if(!all.username) navigate('/');
    }
    return (
        <div className={classes.wrapper}>
            
            <img src={logo} className={classes.logo} alt="Logo Oaxaca"/>
            
            <AccountCircleIcon className={classes.userIcon} onClick={handleClick}/>
            <StyledMenu 
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}    
            >
                <StyledMenuItem>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText primary="Datos de usuario"/>
                </StyledMenuItem>
                
                <StyledMenuItem onClick={handleCloseSession}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText primary="Cerrar sesion"/>
                </StyledMenuItem>
            </StyledMenu>
        </div>
    )
}
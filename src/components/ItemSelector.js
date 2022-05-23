import React from 'react'
import { makeStyles } from '@material-ui/core';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {  useNavigate } from 'react-router-dom';
const styles = makeStyles({
    itemWrapper:{
        width: "90%",
        backgroundColor: "rgba(22,130,100,0.9)",
        borderRadius: "20px",
        padding: "0 1rem",
        margin: "1rem 0.5rem 0 0.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text:{
        textDecoration: "underline",
        fontWeight: "600",
        fontSize: "20px"
    },
    icon:{
        fontSize: "35px",
        color: "black",
        background: "white",
        borderRadius: "50%",
        textAlign: "justify",
        padding: "0.2rem 0.2rem 0 0.2rem",
        margin: " 1rem",
        "&:hover":{
            cursor: "pointer",
            backgroundColor: "rgb(200,200,200)"
        }
    },
})
export default function ItemSelector(props) {
    const classes = styles();
    const navigate = useNavigate();
  return (
    <div className={classes.itemWrapper}>
        <div className={classes.text}>
            {props.id?props.id:("ID ITEM")}
        </div>
        <div className={classes.text}>
            {props.nombre?props.nombre.toUpperCase():("NOMBRE ITEM")}
        </div>
        <div>
            {props.nombre?(<>
            
                <CreateOutlinedIcon className={classes.icon} onClick={() => {
                console.log(props)
                navigate(`${props.id}`)}}/>
            <DeleteOutlineOutlinedIcon className={classes.icon} onClick={() => props.delete(props.id)}/>
        
            </>):<AddBoxIcon className={classes.icon} onClick={() => navigate(`0`) }/>}
        </div>
    </div>
  )
}

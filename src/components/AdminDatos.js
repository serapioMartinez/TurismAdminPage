import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const styles = makeStyles({
    
    icon:{
        color: "black",
        background: "white",
        borderRadius: "20px",
        textAlign: "justify",
        padding: "0.2rem 0.2rem 0 0.2rem",
        margin: " 1rem"
    },
    dataWrapper:{

    },
    username:{

    },
    data:{

    },
    
});

export default function AdminDatos(props) {
    const classes = styles();

    const [datos, setDatos] = useState({
        "nombre": '',
        "correo": '',
        "foto": null,
        "cargo": '',
        
    });
    const handleDatos = () => {
        console.log("Renderizando AdminDatos")
        if(datos.nombre==''){
            axios.get("http://localhost:5000/admin_establecimiento/usuario",{
            params:{
                id: cookies.get('userId')
            }
        }).then(res => {
            setDatos({
                nombre: res.data.NOMBRE, 
                correo: res.data.CORREO,
                foto: res.data.FOTO,
                cargo: res.data.CARGO,
            })
            console.log(res.data);
            if(cookies.get('userType')=='CIUDAD') props.action('ciudad');
            else props.action('establecimiento')
            
        }).catch(err => {
            console.log(err.message)
            alert("Ha ocurrido un error. Por favor recargue la pagina!")
        })
        }
    }
    useEffect(()=>handleDatos(),[])
  return (
    <div id="user-data" className="wrapper">
            
        <h2 className="title">DATOS DEL ADMINISTRADOR</h2>
        
        <div id='user-image' className={classes.icon}>
            <AccountCircleIcon style={{fontSize: 80}}/>
        </div>
        <div className={classes.dataWrapper}>
            <h1 className={classes.username}>Bienvenido: {cookies.get('username')}</h1>
            <h2 className={classes.data}>CARGO: {datos.cargo?datos.cargo:"<< CARGO >>"}</h2>
            <h2 className={classes.data}>ID: {cookies.get('userId')}</h2>
        </div>
        <div>
            <Link to={"/ciudad/usuario"} state={{
                    nombre: datos.nombre,
                    correo: datos.correo,
                    cargo: datos.cargo,
                    foto: datos.foto,
                }}><button className="boton">EDITAR</button></Link>
        </div>
    </div>
  )
}

import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
const cookie = new Cookies();
const styles = makeStyles({
    icon:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        color: "rgb(161, 171, 15)",
        borderRadius: "20px",
        textAlign: "justify",
        padding: "0.2rem 0.2rem 0 0.2rem"
    },
    dataWrapper:{

    },
    cityName:{

    },
    data:{

    },
    calificacion:{
        fontSize: "50px",
        color: "rgb(255, 112, 81)"
    }
    
});

export default function EstablecimientoDatos(props) {
    const classes = styles();
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        'id': cookie.get('establecimientoId'),
        'nombre':null,
        'correo':null,
        'telefono':null,
        'calificacion': null,
        "tipo": null

    });
    useEffect(()=>{
        if(cookie.get('establecimientoId') && datos.nombre==null && props.status==true){
            axios.get(`http://localhost:5000/no_users/establecimientos/${cookie.get('establecimientoId')}/0`)
            .then(res => {
                const data = res.data;
                console.log(data)
                setDatos({...datos,
                    nombre: data.NOMBRE,
                    correo: data.CORREO,
                    telefono: data.TELEFONO,
                    calificacion: data.CALIFICACION,
                    tipo: data.TIPO
                })
                props.action('atencion')
            }).catch(err=>{
                console.log("Error: ",err.message);
                alert("Ha ocurrido un error al intentar obtener los datos de la ciudad administrada. ¡Por favor recargue la pagina!")
            });
    }
    },[props.status])
    
  return (
    <div id="user-data" class="wrapper">
            
        <h2 class="title">DATOS DE ESTABLECIMIENTO</h2>
        
        <div className={classes.icon}>
            <StarIcon style={{fontSize: 80}}/>
            <span className={classes.calificacion}>{datos.calificacion!=null?datos.calificacion: "0"}</span>
        </div>
        <div className={classes.dataWrapper}>
            <h1 className={classes.cityName}>{datos.nombre!=null?datos.nombre:"<<NOMBRE ESTABLECIMIENTO>>"}</h1>
            <h2 className={classes.data}>TIPO: {datos.tipo!=null?datos.tipo:"<< TIPO >>"}</h2>
            <h2 className={classes.data}>CORREO: {datos.correo!=null?datos.correo:"<< CORREO >>"}</h2>
            <h2 className={classes.data}>TELEFONO: {datos.telefono!=null?datos.telefono:"<< TELEFONO >>"}</h2>
        </div>
        <div>
            <button onClick={() => navigate('/establecimiento/establecimiento')} class="boton">EDITAR</button>
        </div>
    </div>
  )
}

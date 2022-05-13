import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { Link } from 'react-router-dom';
import Cookie from 'universal-cookie';
import axios from 'axios';
const cookie = new Cookie();
const styles = makeStyles({
    icon: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        color: "rgb(161, 171, 15)",
        borderRadius: "20px",
        textAlign: "justify",
        padding: "0.2rem 0.2rem 0 0.2rem"
    },
    calificacion: {
        fontSize: "50px",
        color: "rgb(255, 112, 81)"
    }

});

const regiones={
    'CN':'CAÑADA',
    'CT':'COSTA',
    'IT':'ITSMO',
    'MX':'MIXTECA',
    'PP':'PAPALOAPAN',
    'SS':'SIERRA SUR',
    'SN':'SIERRA NORTE',
    'VC':'VALLES CENTRALES'
}

export default function CiudadDatos(props) {
    const classes = styles();
    const [datos, setDatos] = useState({
        'id': cookie.get('ciudadId'),
        'nombre':null,
        'region':null,
        'municipio':null,
        'correo':null,
        'telefono':null,
        'magico': 0,
        'tipos': null,
        'emergencias':null,
        'calificacion': 0,
        'descripcion': null,
        'foto':null

    });
    useEffect(()=>{
        if(cookie.get('ciudadId') && datos.nombre==null && props.status==true){
            axios.get(`http://localhost:5000/no_users/lugares/${cookie.get('ciudadId')}`)
            .then(res => {
                const data = res.data;
                console.log(data)
                setDatos({...datos,
                    nombre: data.NOMBRE,
                    region: data.REGION,
                    municipio: data.MUNICIPIO,
                    correo: data.CORREO,
                    telefono: data.TELEFONO,
                    magico: data.MAGICO,
                    tipos: data.TIPOS,
                    emergencias: data.EMERGENCIAS,
                    calificacion: data.CALIFICACION,
                    descripcion: data.DESCRIPCION,
                    foto: data.FOTO
                })
                props.action('establecimientos')
            }).catch(err=>{
                console.log("Error: ",err.message);
                alert("Ha ocurrido un error al intentar obtener los datos de la ciudad administrada. ¡Por favor recargue la pagina!")
            });
    }
    },[props.status])
    return (
        <div id="user-data" className="wrapper">

            <h2 className="title">DATOS DE CIUDAD</h2>

            <div className={classes.icon}>
                <StarIcon style={{ fontSize: 80 }} />
                <span className={classes.calificacion}>{datos.calificacion}</span>
            </div>
            <div className={classes.dataWrapper}>
                <h1 className={classes.cityName}>{datos.nombre?datos.nombre:"<<CITY NAME>>"}</h1>
                <h2 className={classes.data}>MUNICIPIO: {datos.municipio?datos.municipio:"<<CARGO>>"}</h2>
                <h2 className={classes.data}>REGION: {datos.region?regiones[datos.region]:"<<ID>>"}</h2>
            </div>
            <div>
                <Link to='/ciudad/ciudad' state={{
                    ciudad: cookie.get('ciudadId')
                }}><button className="boton">EDITAR</button></Link>
            </div>
        </div>
    )
}

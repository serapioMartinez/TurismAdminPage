import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookie = new Cookies();
const styles = makeStyles({
    wrapper: {
        marginTop: "6rem",
        position: "relative",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "60%",
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: "20px",
        marginLeft: "6rem",
        padding: "0.5rem",
        color: "white",
    },
    boton: {
        position: "absolute",
        bottom: "-15px",
        left: "50%",
        transform: "translate(-50%,0)",
        borderRadius: "30px",
        fontWeight: "bold",
        color: "white",
        padding: "1rem 1.5rem",
        border: "solid 0px",
    },
    titulo:{
        fontSize: "20px",
        top: "-30px",
        left: "20px"
    },
    itemList:{
        fontSize: "20px",
        fontWeight: "500",
        fontStyle: "italic",
        color: "white",
        textDecoration: "none",
        '&:hover':{
            color: "#668899"
        }
    },
    listaItems: {
        margin: "1rem 1rem 2rem 0"
    },
    dataWrapper1: {
        margin: "auto",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    }
});

export default function ItemInfo(props) {
    const classes = styles();
    const [items, setItems] = useState([]);
    const [print, setPrint] = useState(false);
    useEffect(() => {
        if (props.status == true) {
            let url = "http://localhost:5000/no_users/";
            switch (props.type) {
                case "establecimientos": url += `busqueda/establecimientos/${cookie.get('ciudadId')}`; break;
                case "platillos":
                case "zonas":
                case "personajes":
                case "festividades":
                case "notas": url += `items/${cookie.get('ciudadId')}/${props.type.toUpperCase()}`; break;
                case "atencion": url+=`horario_atencion/${cookie.get('establecimientoId')}`; break;
                case "direcciones": url+=`direcciones/${cookie.get('establecimientoId')}`; break;
                case "transporte": url+=`salidas/${cookie.get('establecimientoId')}`; break;
            }
            setTimeout(()=>{
                axios.get(url).then(res => {
                    let newItems = [];
                    res.data.forEach(element => {
                        newItems.push(element);
                    });
                    setItems([...newItems]);
                }).catch(err => {
                    console.log("Error: " + err.message)
                })
            },50)
        }
    }, [props.status]);
    useEffect(()=>{
        setPrint(true);
        props.action(props.next);
    },[items])
    return (
        <div>
            <div id="user-data" className={classes.wrapper}>

                <h2 className={"title "+classes.titulo}>{props.type.toUpperCase()}</h2>
                <div className={classes.dataWrapper}>
                    <ul className={classes.listaItems}>
                        {
                            print?(
                                items.map(item => {
                                    if(item.NOMBRE) return <Link key={item.ID} className={classes.itemList} to={`${(cookie.get('userType')=="CIUDAD")?"/ciudad/" :"/establecimiento/"}${props.type}/${item.ID}`}><li id={item.ID}>{item.ID} - {item.NOMBRE.toUpperCase()}</li></Link>
                                    else return (
                                        <>
                                        <li>LUNES: {item.LUNES}</li>
                                        <li>MARTES: {item.MARTES}</li>
                                        <li>MIERCOLES: {item.MIERCOLES}</li>
                                        <li>JUEVES: {item.JUEVES}</li>
                                        <li>VIERNES: {item.VIERNES}</li>
                                        <li>SABADO: {item.SABADO}</li>
                                        <li>DOMINGO: {item.DOMINGO}</li>
                                        </>
                                    );
                                })
                            ): (<li>{"<<NOMBRE DEL ITEM>>"}</li>)
                        }
                        
                    </ul>
                </div>
                <div>
                    <Link to={(cookie.get('userType')=="CIUDAD")?"/ciudad/"+ props.type :"/establecimiento/"+ props.type}><button disabled={cookie.get('establecimientoId')=='null'} className={"boton " + classes.boton}>EDITAR</button></Link>
                </div>
            </div>
        </div>
    )
}

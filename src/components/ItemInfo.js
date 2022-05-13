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
            }
            setTimeout(()=>{
                axios.get(url).then(res => {
                    let newItems = [];
                    console.log(res.data)
                    res.data.forEach(element => {
                        console.log(element)
                        console.log(typeof (element))
                        newItems.push(element);
                    });
                    console.log(newItems)
                    setItems([...newItems]);
                }).catch(err => {
                    console.log("Error: " + err.message)
                })
            },50)
        }
    }, [props.status]);
    useEffect(()=>{
        console.log(items);
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
                                items.map(({ID, NOMBRE}) => {
                                    return <Link key={ID} className={classes.itemList} to={`/ciudad/${props.type}/${ID}`}><li id={ID}>{ID} - {NOMBRE.toUpperCase()}</li></Link>
                                })
                            ): (<li>{"<<NOMBRE DEL ITEM>>"}</li>)
                        }
                        
                    </ul>
                </div>
                <div>
                    <Link to={"/ciudad/" + props.type}><button className={"boton " + classes.boton}>EDITAR</button></Link>
                </div>
            </div>
        </div>
    )
}

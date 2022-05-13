import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import ItemSelector from '../components/ItemSelector';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookie = new Cookies();

const styles = makeStyles({
    containerButtons: {
        display: "flex",
        justifyContent: "space-around",
        width: "90%",
        position: "absolute",
        bottom: "-30px"
    },
    wrapper: {
        flexWrap: "wrap",
        paddingBottom: "1.5rem"
    },
    boton: {
        position: 'absolute'
    }
})

export default function Items() {
    const classes = styles();
    const params = useParams();
    const [items, setItems] = useState([]);
    const makeRequest = ()=>{
        
        let url = "http://localhost:5000/no_users/";
        switch (params.item) {
            case "establecimientos": url += `busqueda/establecimientos/${cookie.get('ciudadId')}`; break;
            case "platillos":
            case "zonas":
            case "personajes":
            case "festividades":
            case "notas": url += `items/${cookie.get('ciudadId')}/${params.item.toUpperCase()}`; break;
            case "horarios": break;
            case "direccion": break;
        }
        setTimeout(() => {
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
        })
    }
    useEffect(() => {
        makeRequest();
    }, []);
    useEffect(()=>{
        console.log(items)
    },[items]);
    useEffect(()=>{
        makeRequest();
    },[params.item])
    return (
        <div className="container">
            <div className={"wrapper " + classes.wrapper}>
                <h1 className="title">{params.item.toUpperCase()}</h1>
                
                <ItemSelector />
                {
                    items.map(({ID, NOMBRE}) => {
                        return <ItemSelector key={ID} id={ID} nombre={NOMBRE}/>
                    })
                }

                <div className={classes.containerButtons}>
                    <button className='boton'>ANTERIOR</button>
                    <button className='boton'>ANTERIOR</button>
                </div>
            </div>
        </div>
    )
}

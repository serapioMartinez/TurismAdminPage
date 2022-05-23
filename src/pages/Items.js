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
            case "direcciones": url+=`/direcciones/${cookie.get('establecimientoId')}`; break;
            case "transporte": url+=`salidas/${cookie.get('establecimientoId')}`; break;
        }
        setTimeout(() => {
            axios.get(url).then(res => {
                let newItems = [];
                res.data.forEach(element => {
                    console.log(element)
                    newItems.push(element);
                });
                setItems([...newItems]);
            }).catch(err => {
                console.log("Error: " + err.message)
            })
        })
    }
    const handleDeleteItem = ID => {
        console.log(ID);
        const handleOk = res =>{
            const data= res.data;
            if(data.error){
                alert('Ha ocurrido un error! Intente de nuevo mas tarde');
                return;
            }
            alert('Elemento eliminado');
            let index = null;
            items.find((element,i) => {
                if(element.ID==ID){
                    index=i;
                    return true;
                }
            });
            let newItems= [...items];
            newItems.splice(index,1);
            setItems([...newItems]);

        }
        const handleError = err => {
            console.log(err.message);
            alert('Un error ha ocurrido!. Por favor intenta de nuevo mas tarde')
        }
        
        if(cookie.get('userType')=='CIUDAD'){
            axios.delete(`http://localhost:5000/admin_ciudad/delete/${params.item}/${ID}`,{
                data:{
                    data:{
                    username: cookie.get('username'),
                    pass: cookie.get('password')
                    }
                }
            }).then(handleOk).catch(handleError)
        }else{
            //Implementar eliminacion en ESTABLECIMIENTOS
        }
        

    }
    useEffect(makeRequest, []);
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
                        return <ItemSelector key={ID} id={ID} nombre={NOMBRE} delete={handleDeleteItem}/>
                    })
                }

                <div className={classes.containerButtons}>
                    <button className='boton'>ANTERIOR</button>
                    <button className='boton'>SIGUIENTE</button>
                </div>
            </div>
        </div>
    )
}

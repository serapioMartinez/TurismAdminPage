import { FormControl, InputLabel, List, ListItem, ListItemText, makeStyles, NativeSelect } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CssTextField from './CssTextField';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const styles = makeStyles({
    salida_container: {
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        margin: "2rem auto",
        color: "white",
        backgroundColor: "#3CB18Ea1",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "100%",
    },
    hora: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        margin: "2rem auto",
        color: "white",
        padding: "0.5rem",
        width: "100%",
    },
    item_list:{
        '&:hover':{
            backgroundColor: "rgba(255,255,255,0.3)",
            cursor: "pointer"
        }
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
    botones:{
        position: "absolute",
        right: "10px",
        bottom: "-15px",
    },
    formControl: {
        width: "100%",
        margin: "1rem 1rem 0 1rem"
    }
})
const dias = {
    "LN": "LUNES",
    "MT": "MARTES",
    "MR": "MIERCOLES",
    "JV": "JUEVES",
    "VR": "VIERNES",
    "SB": "SABADO",
    "DM": "DOMINGO"
}

function Salida(props) {
    const classes = styles();
    let fakeId=0;
    const [hora, setHora] = useState('');
    let oldHours=[];
    const [horas, setHoras] = useState([]);
    const handleChangeHora = evt => {
        setHora(evt.target.value);
    }
    const handleAddHora = () => {
        if(horas.length!=0){
            if(horas.find(hr => hr.HORA==hora)){
                alert("Esta hora ya existe!");
                return;
            }
        }
        let newHoras = [...horas];
        newHoras.push({
            ID: fakeId,
            HORA: hora
        });
        fakeId+=1;
        setHoras([...newHoras])
    }
    const handlePutHour = (hour) => {
        
        setHora(hour);
    }
    const handleDeleteHour = () => {
        if(horas.length==0){
            alert("Aun no hay contenido en la lista!");
            return;
        }
        const index =horas.findIndex(hr => hr.HORA==hora);
            if(index<0){
                alert("Esta hora aun no existe en la lista");
                return;
            }
        const item = horas.find(hr => hr.HORA==hora)
            if(props.id>0 && item.ID>0){
                axios.delete(`http://localhost:5000/admin_establecimiento/horaSalida`,{
                    data:{
                        data:{
                        username: cookies.get('username'),
                        pass: cookies.get('password'),
                        id: item.ID
                        }
                    }
                }).then(res => {
                    const data = res.data;
                    if(data.error){
                        console.log(data.error);
                        alert(data.error);
                        return;
                    }
                    let newHoras = [...horas];
                    newHoras.splice(index,1);
                    setHoras([...newHoras])
                }).catch(err => {
                    console.log(err.message);
                    alert("Un error ha ocurrido, intente de nuevo mas tarde!");
                })
            }
            else{
                let newHoras = [...horas];
                newHoras.splice(index,1);
                setHoras([...newHoras])
            }
            

        
    }
    const handleSaveSalida = () => {
        const handleOk = res => {
            const data = res.data;
            if(data.error){
                console.log(data.error);
                alert(data.error);
                return;
            }
            alert('Datos guardados exitosamente!');
        }
        const handleError = err => {
            console.log(err.message);
            alert("Un erro ha ocurrido, intente de nuevo mas tarde!");
        }
        if(props.duracion<=0 || horas.length==0){
            alert("Por favor introduzca una duracion valida y al menos una hora de salida")
            return;
        }
        if(props.id<=0){
            //Nuevo - POST
            axios.post(`http://localhost:5000/admin_establecimiento/salidas/${cookies.get('establecimientoId')}`,{
                data:{
                    username: cookies.get('username'),
                    pass: cookies.get('password'),
                    ciudad: props.ciudad,
                    dia: props.dia,
                    duracion: props.duracion,
                    horas: diferentHours()
                }
            }).then(handleOk).catch(handleError);
        }else{
            //MODIFICAD - PUT
            axios.put(`http://localhost:5000/admin_establecimiento/salidas/${cookies.get('establecimientoId')}`,{
                data:{
                    username: cookies.get('username'),
                    pass: cookies.get('password'),
                    id: props.id,
                    duracion: props.duracion,
                    horas: diferentHours()
                }
            }).then(handleOk).catch(handleError);
        }
    }
    const handleDeleteSalida = () => {
        if(props.id<=0){
            alert("Aun no existe esta entrada!")
            return;
        }
        if(!window.confirm("¿Desea eliminar el elemento?")) return;
        axios.delete(`http://localhost:5000/admin_establecimiento/salidas/${cookies.get('establecimientoId')}`,{
            data:{
                data:{
                    username: cookies.get('username'),
                    pass: cookies.get('password'),
                    id: props.id
                }
            }
        }).then(res => {
            const data = res.data;
        if(data.error){
            console.log(data.error);
            alert(data.error);
            return;
        }
            setHoras([]);
            setHora(0);
            alert("Eliminado correctamente")
        }).catch(err => {
            console.log(err.message);
            alert("Un erro ha ocurrido, intente de nuevo mas tarde!");
        });
    }
    const diferentHours = () => {
        let solo_horas=[];
        const aux_horas = horas.filter(x => oldHours.indexOf(x) == -1)
        aux_horas.forEach(element => {
            solo_horas.push(element.HORA);
        });
        console.log(solo_horas);
        return solo_horas
    }
    useEffect(() => {
        console.log(props)
        if(props.id<=0)return;
        axios.get(`http://localhost:5000/no_users/horaSalida/${props.id}`)
        .then(res => {
            const data = res.data;
            if(data.error){
                console.log(data.error);
                alert("Un erro ha ocurrido, por favor intenta de nuevo mas tarde!");
                return;
            }
            console.log(data)
            setHoras([...data]);
            oldHours=[...data];
        })
        .catch(err => {
            console.log(err.message);
            alert("Un erro ha ocurrido, por favor intenta de nuevo mas tarde!");

        });
    },[]);
    return (
        <div className={classes.salida_container}>
            <div>
            <InputLabel style={{ color: "white" }}>Horas: </InputLabel>
                <List style={{color: "white",maxHeight: "250px", overflow: "auto"}}>
                {
                    horas.map(hr=> 
                        <ListItem className={classes.item_list} key={hr.ID}  onClick={() => handlePutHour(hr.HORA)}>
                            <ListItemText primary={hr.HORA}/>
                        </ListItem>
                    )
                    }
                </List>

            </div>
            <div style={{width: "70%"}}>
                <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel style={{ color: "white" }}>DIA: </InputLabel>
                            <NativeSelect
                                disabled
                                value={props.dia}
                                style={{
                                    color: "white",
                                    backgroundColor: "#ffffff45",
                                    borderRadius: "5px",
                                    paddingLeft: "0.5rem",
                                    width: "auto",
                                    paddingTop: "0.5rem"
                                }}>
                                <option style={{ backgroundColor: "black" }} value='ND'>Elegir</option>
                                <option style={{ backgroundColor: "black" }} value='LN'>{dias.LN}</option>
                                <option style={{ backgroundColor: "black" }} value='MT'>{dias.MT}</option>
                                <option style={{ backgroundColor: "black" }} value='MR'>{dias.MR}</option>
                                <option style={{ backgroundColor: "black" }} value='JV'>{dias.JV}</option>
                                <option style={{ backgroundColor: "black" }} value='VR'>{dias.VR}</option>
                                <option style={{ backgroundColor: "black" }} value='SB'>{dias.SB}</option>
                                <option style={{ backgroundColor: "black" }} value='DM'>{dias.DM}</option>

                            </NativeSelect>

                        </FormControl>
                        <CssTextField
                            required
                            type='number'
                            value={props.duracion}
                            onChange={props.action(props.index)}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="DURACION" />
                </div>
                <div className={classes.hora}>
                        <CssTextField
                            required
                            type='time'
                            value={hora}
                            onChange={handleChangeHora}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="HORA" />
                        
                        <button className='boton' onClick={handleAddHora}>+</button>
                        <button className='boton' onClick={handleDeleteHour}>-</button>
                </div>
                <div className={classes.botones}>
                    <button className='boton' onClick={handleDeleteSalida}>ELIMINAR</button>
                    <button className='boton' onClick={handleSaveSalida}>GUARDAR</button>
                </div>
            </div>
        </div>
    )
}

export default Salida
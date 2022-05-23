import React, { useEffect, useState } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StarIcon from '@material-ui/icons/Star';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { FormControl, InputLabel, makeStyles, NativeSelect } from '@material-ui/core';
const cookies = new Cookies();
const styles = makeStyles({
    input: {
        boxSizing: "border-box",
        position: "relative",
        margin: "2rem 0",
        color: "white",
        backgroundColor: "#3CB18Ea1",
        borderRadius: "5px",
        padding: "0.5rem",
        paddingBottom: "3rem",
        width: "100%",
    },
    switch: {
        position: "absolute",
        top: "0px",
        right: "0px"
    },
    formData: {
        width: "100%",
        minWidth: "20rem",
        maxWidth: "30rem",
        padding: " 0.5rem 1rem"
    },
    userImage: {
        boxSizing: "border-box",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        MaxWidth: "50%",
        padding: "1rem "
    },
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
    iconInput: {
        position: "absolute",
        top: "-20px",
        left: "-20px",
        fontSize: "40px",

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
    imageContainer: {
        width: "90%",
        height: "15rem",
        backgroundColor: "#666666",
        border: "solid 4px #fff",
        borderRadius: "10px"
    },
    paper: {
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: 400,
        backgroundColor: "#666666",
        border: '2px solid #000',
        borderRadius: "10px"
    },
    formControl: {
        width: "100%",
        margin: "1rem 1rem 0 1rem"
    }
    , calificacion: {
        fontSize: "40px",
        color: "rgb(255, 112, 81)"
    },
    items: {
        width: '100%',
        margin: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    item: {
        position: 'relative',
        width: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        margin: "auto 1rem",
        padding: '0.5rem',
        paddingBottom: '2.2rem',
        borderRadius: '10px',
        backgroundColor: "#3CB18Ea1"
    }
})
const tipoEstablecimento = {
    "NT": "NO HAY TIPO",
    "RS": "RESTAURANTE",
    "HT": "HOTEL",
    "TR": "TRANSPORTE",
    "MR": "MERCADO",
    "BN": "BANCO",
    "GB": "GOBIERNO",
    "SP": "SUPERMERCADO",
    "AB": "ABARROTES"

}
function EstablecimientoClaim() {
    const navigate = useNavigate();
    const classes = styles();
    const [ciudad, setCiudad] = useState('0');
    const [tipo, setTipo] = useState('NT');
    const [ciudades, setCiudades] = useState([]);
    const [establecimiento, setEstablecimientos] = useState([]);
    const handleCiudad = evt => {
        setCiudad(evt.target.value);
    }
    const handleTipo = evt => {
        setTipo(evt.target.value);
    }
    const handleConsult = () => {
        if (ciudad == 0) {
            alert("por favor escoje una ciudad de la lista");
            return;
        }
        axios.get(`http://localhost:5000/no_users/busqueda/establecimientos/${ciudad}`, {
            params: {
                tipo: tipo
            }
        }).then(res => {
            const data = res.data;
            if (data.error) {
                console.log(data.error)
                alert("Ha ocurrido un error, Intente de nuevo!")
                return;
            }
            console.log(data);
            setEstablecimientos(data);
        }).catch(err => {
            console.log(err.message)
            alert("Ha ocurrido un error, Intente de nuevo!")
        })
    }
    const handleClaim = ID => {
        if (!window.confirm("¿Estas seguro que deseas reclamar este establecimiento? ¡Una vez hecho no podra hacerlo con otro!")) return;
        axios.post('http://localhost:5000/admin_establecimiento/reclamarEstablecimiento', {
            data: {
                username: cookies.get('username'),
                pass: cookies.get('password'),
                establecimiento: ID
            }
        }).then(res => {
            let data = res.data;
            if(data.error){
                alert('Un error a ocurrido, intente de nuevo mas tarde!');
                return;
            }
            data = data[0];
            console.log(data)
            cookies.set('establecimientoId',data[0].ID,{
                path:'/'
            });
            alert("Proceso exitoso!");
            navigate('/establecimiento/inicio')
        })
        .catch(err => {
            console.log(err.message);
            alert('Un error ha ocurrido, intente de nuevo mas tarde!');
        })
    }
    useEffect(() => {
        axios.get('http://localhost:5000/no_users/listarCiudades')
            .then(
                res => {
                    const data = res.data;
                    setCiudades([...data])
                }
            ).catch(err => {
                console.log(err.message)
            });
    }, []);
    return (
        <div className='container'>
            <div className='wrapper'>
                <h1 className='title'>RECLAMAR ESTABLECIMIENTO</h1>
                <div>
                    <div className={classes.formData}>
                        <div className={classes.input}>
                            <AccountCircleIcon className={classes.iconInput} />
                            <FormControl className={classes.formControl}>
                                <InputLabel style={{ color: "white" }}>CIUDAD</InputLabel>
                                <NativeSelect
                                    value={ciudad}
                                    onChange={handleCiudad}
                                    id='ciudad'
                                    style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                                    <option style={{ backgroundColor: "black" }} value="0">Seleccionar Ciudad</option>
                                    {ciudades.map(ciud => <option key={ciud.ID} style={{ backgroundColor: "black" }} value={ciud.ID}>{ciud.CIUDAD}</option>)}

                                </NativeSelect>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel style={{ color: "white" }}>TIPO ESTABLECIMIENTO</InputLabel>
                                <NativeSelect
                                    value={tipo}
                                    onChange={handleTipo}
                                    id='ciudad'
                                    style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                                    <option style={{ backgroundColor: "black" }} value="NT">Tipo de establecimiento</option>
                                    <option style={{ backgroundColor: "black" }} value="AB">{tipoEstablecimento.AB}</option>
                                    <option style={{ backgroundColor: "black" }} value="BN">{tipoEstablecimento.BN}</option>
                                    <option style={{ backgroundColor: "black" }} value="GB">{tipoEstablecimento.GB}</option>
                                    <option style={{ backgroundColor: "black" }} value="HT">{tipoEstablecimento.HT}</option>
                                    <option style={{ backgroundColor: "black" }} value="MR">{tipoEstablecimento.MR}</option>
                                    <option style={{ backgroundColor: "black" }} value="NT">{tipoEstablecimento.NT}</option>
                                    <option style={{ backgroundColor: "black" }} value="RS">{tipoEstablecimento.RS}</option>
                                    <option style={{ backgroundColor: "black" }} value="SP">{tipoEstablecimento.SP}</option>
                                    <option style={{ backgroundColor: "black" }} value="TR">{tipoEstablecimento.TR}</option>

                                </NativeSelect>
                            </FormControl>
                            <button className={"boton " + classes.boton} onClick={handleConsult}>CONSULTAR</button>
                        </div>
                    </div>
                    <div className={classes.items}>
                        {establecimiento.map(element =>

                            <div key={element.ID} className={classes.item}>
                                <div className={classes.icon}>
                                    <StarIcon style={{ fontSize: 60 }} />
                                    <span className={classes.calificacion}>{element.CALIFICACION}</span>
                                </div>
                                <div>
                                    <h3>{element.NOMBRE}</h3>
                                    <span>ID: {element.ID}</span>
                                </div>
                                {element.PRO != '0' ? false : <button className={"boton " + classes.boton} onClick={()=>{
                                    handleClaim(element.ID)
                                }}>RECLAMAR</button>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstablecimientoClaim
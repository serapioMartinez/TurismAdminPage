import React, { useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { FormControlLabel, FormControl, InputLabel, NativeSelect, FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5';
import CssTextField from '../components/CssTextField';

import logo from "../logo-oaxaca.svg"
import axios from 'axios';

const styles = makeStyles({
    input: {
        boxSizing: "border-box",
        position: "relative",
        margin: "2rem 0",
        color: "white",
        backgroundColor: "#3CB18Ea1",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "100%",
    },
    switch: {
        position: "absolute",
        top: "0px",
        right: "0px"
    },
    formData: {
        width: "100%",
        padding: " 0.5rem 1rem"
    },
    userImage: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
        width: "30rem"
    },
    icon: {
        margin: "3rem 1rem 0 1rem"
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


    formControl: {
        width: "100%",
        margin: "1rem 1rem 0 1rem"
    },img: {
        margin: "1rem auto",
        maxWidth: "200px"
    }
})
function Registration() {
    const mailRegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    const userRegExp = /^[^@"'<>| ]+[a-zA-Z-0-9]{5,}$/i;
    const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&\_\-<>])([\w$@$!#%*?&\_\-<>]|[^ ]){8,20}$/;
  
    const navigate = useNavigate();
    const classes = styles();
    const [datos, setDatos] = useState({
        tipo: "CIUDAD",
        usuario: '',
        pass: '',
        pass_ver: '',
        nombre:'',
        correo:'',
        cargo:'',
        usuarioOk: true,
        correoOk: true,
        passOk: true,
        passVerOk: true
    });
    const handleDatos= prop => evt => {
        const val = evt.target.value;
        switch (prop){
            case 'usuario':
                setDatos({...datos, usuario: val, usuarioOk: userRegExp.test(val)});break;
            case 'pass':
                setDatos({...datos, pass: val, passOk: passRegExp.test(val)});break;
            case 'pass_ver':
                setDatos({...datos, pass_ver: val, passVerOk: val==datos.pass});break;
            case 'correo':
                setDatos({...datos, correo: val, correoOk: mailRegExp.test(val)});break;
            default:
                setDatos({...datos,[prop]: evt.target.value}); break;   
        }
    }
    const handleRegistrarUsuario = () => {
        if(datos.usuarioOk && datos.passOk && datos.passVerOk && datos.correoOk){
            axios.post(`http://localhost:5000/create_user/${datos.tipo}`,{
                data: {
                    username: datos.usuario,
                    correo: datos.correo,
                    clave: md5(datos.pass),
                    nombre: datos.nombre,
                    cargo: datos.cargo
                }
            }).then(res => {
                const data = res.data;
                if(data.error){
                    console.log(data.error);
                    alert("Un error ha ocurrido por favor intenta de nuevo mas tarde!");
                    return;
                }
                
                if(data.unique){
                    console.log(data.unique);
                    alert("No se puede crear por datos en uso: ,\n"+data.unique)
                    return;
                }
                console.log(data)
                alert('Usuario creado correctamente, por favor proceda a iniciar sesion!');
                navigate('/');
            }).catch(err => {
                console.log(err.message);
                alert("Un error ha ocurrido por favor intenta de nuevo mas tarde!");
            });
        }else{
            alert('Asegurese de llenar los campos correctamente');
            return;
        }
    }
    return (
        <div className='container'>
            <div className='wrapper'>
                <h1 className='title'>Registrar administrador</h1>
                <img className={classes.img} src={logo} />
                <div className={classes.formData}>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <FormControl className={classes.formControl}>
                            <InputLabel style={{ color: "white" }}>Tipo de cuenta</InputLabel>
                            <NativeSelect
                                value={datos.tipo}
                                onChange={handleDatos('tipo')}
                                style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                                <option style={{ backgroundColor: "black" }} value='CIUDAD'>ADMINISTRADOR CIUDAD</option>
                                <option style={{ backgroundColor: "black" }} value='ESTABLECIMIENTO'>ADMINISTRADOR ESTABLECIMIENTO</option>
                            </NativeSelect>
                        </FormControl>
                    </div>

                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            value={datos.usuario}
                            onChange={handleDatos('usuario')}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Usuario" />
                        <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.usuarioOk ? '' : 'Usuario debe contener de 2 a 20 caracteres excepto  @ \" \' <> o espacio '}
            </FormHelperText>
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            type="password"
                            value={datos.pass}
                            onChange={handleDatos('pass')}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Contraseña" />
                        <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.passOk ? '' : 'La contraseña debe tener de 8 a 20 caracteres, incluir caracteres alfanumericos, simbolos(<>,-#&%) y evitar usar comillas'}
            </FormHelperText>
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            type="password"
                            value={datos.pass_ver}
                            onChange={handleDatos('pass_ver')}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Verificar Contraseña" />
                        <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.passVerOk ? '' : 'La contraseña debe ser la misma que la anterior'}
            </FormHelperText>
                    </div>
                    <span> -- Datos del usuario --</span>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            value={datos.nombre}
                            onChange={handleDatos('nombre')}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Nombre" />
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            type="mail"
                            value={datos.correo}
                            onChange={handleDatos('correo')}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Correo" />
                        <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.correoOk ? '' : 'Formato de correo invalido'}
            </FormHelperText>
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            value={datos.cargo}
                            onChange={handleDatos('cargo')}
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Cargo" />
                    </div>
                </div>
                <button className={"boton " + classes.boton} onClick={handleRegistrarUsuario}>ACEPTAR</button>
            </div>
        </div>
    )
}

export default Registration;
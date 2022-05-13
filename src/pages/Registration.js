import React, { useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { FormControlLabel, FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import CssTextField from '../components/CssTextField';

import logo from "../logo-oaxaca.svg"

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
    }
})
function Registration() {
    const classes = styles();
    const [enableInputs, setEnableInputs] = useState({
        "usuario": true,
        "nombre": true,
        "correo": true,
        "cargo": true
    });
    const handleEnableInputs = (item) => {
        const newEnables = JSON.parse(JSON.stringify(enableInputs));
        newEnables[item] = !newEnables[item];
        setEnableInputs(newEnables);
    }
    return (
        <div className='container'>
            <div className='wrapper'>
                <h1 className='title'>Registrar administrador</h1>
                
                <div className={classes.formData}>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <FormControl className={classes.formControl}>
                            <InputLabel style={{ color: "white" }}>Tipo de cuenta</InputLabel>
                            <NativeSelect
                                style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                                <option style={{ backgroundColor: "black" }}>ADMINISTRADOR CIUDAD</option>
                                <option style={{ backgroundColor: "black" }}>ADMINISTRADOR ESTABLECIMIENTO</option>
                            </NativeSelect>
                        </FormControl>
                    </div>

                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Usuario" />
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            type="password"
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Contraseña" />
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            type="password"
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Verificar Contraseña" />
                    </div>
                    <span> -- Datos del usuario --</span>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Nombre" />
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                        type="mail"
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Correo" />
                    </div>
                    <div className={classes.input}>
                        <AccountCircleIcon className={classes.iconInput} />
                        <CssTextField
                            className={classes.margin}
                            style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                            id="custom-css-standard-input" label="Cargo" />
                    </div>
                </div>
                <button className={"boton " + classes.boton}>ACEPTAR</button>
            </div>
        </div>
    )
}

export default Registration;
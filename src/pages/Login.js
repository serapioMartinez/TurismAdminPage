
import React, { createRef, useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, makeStyles, NativeSelect, FormHelperText } from '@material-ui/core';
import logo from '../logo-oaxaca.svg';
import logoReact from '../logo.svg';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import CssTextField from '../components/CssTextField';

import axios from 'axios';
import md5 from 'md5';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const styles = makeStyles({
  wrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#1C0930dd",
    borderRadius: "20px",
    width: "50%",
    padding: "1rem 4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"

  },
  input: {
    boxSizing: "border-box",
    position: "relative",
    margin: "2rem 0",
    color: "white",
    backgroundColor: "#3CB18Ea1",
    borderRadius: "5px",
    padding: "0.5rem",
    minWidth: "500px",
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
  img: {
    margin: "1rem auto",
    maxWidth: "60%"
  },
  formControl: {
    width: "100%",
    margin: "1rem 1rem 0 1rem"
  }
})


export default function Login() {
  const classes = styles();
  let navigate = useNavigate();

  const mailRegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  const userRegExp = /^[^@"'<>| ]+[a-zA-Z-0-9]{5,}$/i;
  const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&\_\-<>])([\w$@$!#%*?&\_\-<>]|[^ ]){8,20}$/;
  let sel = createRef();
  let user = createRef();
  let pass = createRef();

  const [datos, setDatos] = useState({
    username: '',
    password: '',
    userType: 'CIUDAD',
    userOK: true,
    passOk: true,
    isLoading: false
  });
  const handleIniciarSesion = () => {
    let url = "";
    let endpoint="";
    if (datos.passOk && datos.userOK) {
      setDatos({ ...datos, isLoading: true });
      if (datos.userType === "CIUDAD"){
        url = "http://localhost:5000/admin_ciudad/sesion";
        endpoint="ciudad";
      }
      else if (datos.userType === "ESTABLECIMIENTO"){
        url = "http://localhost:5000/admin_establecimiento/sesion";
        endpoint="establecimiento"
      }
      setTimeout(() => {
        axios.post(url, {
          data: {
            "username": datos.username,
            "pass": md5(datos.password)
          },

        }).then(res => {
          setDatos({ ...datos, isLoading: false })
          if(res.data.error) {
            alert(res.data.error);
            return;
          }
          let expiracion = new Date();
          expiracion.setHours(expiracion.getHours()+6);
          console.log(expiracion)
          cookies.set("username", datos.username, {
            path:'/',
            expires: expiracion
          });
          cookies.set("userType", datos.userType, {
            path:'/',
            expires: expiracion
          });
          cookies.set("password", md5(datos.password), {
            path:'/',
            expires: expiracion
          });
          cookies.set("userId", res.data.ID, {
            path:'/',
            expires: expiracion
          });
          if(datos.userType== "CIUDAD"){
            cookies.set("ciudadId", res.data.CIUDAD, {
              path:'/',
              expires: expiracion
            });
          }else{
            cookies.set("establecimientoId", res.data.ESTABLECIMIENTO, {
              path:'/',
              expires: expiracion
            });
          }

          navigate(endpoint)
          
        }).catch(err => {
          setDatos({ ...datos, isLoading: false });
          console.log(err.message);
          alert("Ha ocurrido un error! Intente nuevamente ")
        })
      }, 2000);
    } else alert("Debe llenar correctamente los campos!")

  }
  const handleState = (prop) => (evt) => {

    if (prop === "username") setDatos({ ...datos, [prop]: evt.target.value, userOK: userRegExp.test(evt.target.value) })
    else if (prop === "password") setDatos({ ...datos, [prop]: evt.target.value, passOk: passRegExp.test(evt.target.value) })
    else if (prop === "userType") setDatos({ ...datos, [prop]: evt.target.value });
    else return;
  }

  useEffect(()=>{
    if(cookies.get('username') && cookies.get('password') && cookies.get('userId') && cookies.get('userType')) {
      
      navigate(cookies.get('userType').toLowerCase())
    }
  },[])

  return (
    <div className={classes.wrapper}>
      <img className={classes.img} src={logo} />
      <div>
        {!datos.isLoading ? <>

          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <FormControl className={classes.formControl}>
              <InputLabel style={{ color: "white" }}>Tipo de cuenta</InputLabel>
              <NativeSelect
                onChange={handleState("userType")}
                value={datos.userType}
                ref={sel}
                id='userType'
                style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                <option style={{ backgroundColor: "black" }} value="CIUDAD">CIUDAD</option>
                <option style={{ backgroundColor: "black" }} value="ESTABLECIMIENTO">ESTABLECIMIENTO</option>
              </NativeSelect>
            </FormControl>
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              ref={user}
              onChange={handleState("username")}
              value={datos.username}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="username" label="Usuario" />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.userOK ? '' : 'Usuario debe contener de 2 a 20 caracteres excepto  @ \" \' <> o espacio '}
            </FormHelperText>
          </div>

          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              ref={pass}
              onChange={handleState("password")}
              value={datos.password}
              type='password'
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="password"
              label="Contraseña" />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.passOk ? '' : 'La contraseña debe tener de 8 a 20 caracteres, incluir caracteres alfanumericos, simbolos(<>,-#&%) y evitar usar comillas'}
            </FormHelperText>
          </div>
        </> : <img src={logoReact} className='App-logo' />}
      </div>
      <div style={{ textAlign: "center", color: "#4302AB", fontWeight: "bold" }}>
        {/*<span>¿Olvidaste tu contraseña?</span>*/}
        <p style={{ color: "white" }}>¿No tienes una cuenta? - <span style={{ color: "#4302AB" }} onClick={() => navigate('/registro')}>Crear cuenta</span></p>
      </div>
      <button className='boton' style={{ width: "50%", margin: "0.5rem auto" }}
        onClick={handleIniciarSesion}>INGRESAR</button>
    </div>
  )
}

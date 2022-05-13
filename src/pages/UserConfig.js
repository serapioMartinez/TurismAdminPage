import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { FormControlLabel, FormHelperText, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import CssTextField from '../components/CssTextField';
import CstSwitch from '../components/CstSwitch';
import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "30rem"
  },
  icon: {
    width: "90%",
    height: "15rem",
    border: "solid 4px #fff",
    borderRadius: "10px",
    textAlign: "center"
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
  }
})


function UserConfig() {

  const mailRegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  const userRegExp = /^[^@"'<>| ]+[a-zA-Z-0-9]{5,}$/i;
  const classes = styles();
  const location = useLocation();
  const [enableInputs, setEnableInputs] = useState({
    "usuario": true,
    "nombre": true,
    "correo": true,
    "cargo": true
  });

  const [dataInput, setDataInput] = useState({
    "usuario": cookies.get('username'),
    "nombre": location.state.nombre,
    "correo": location.state.correo,
    "cargo": location.state.cargo,
    "foto": location.state.foto,
    "usuarioOK": true,
    "correoOK": true
  })

  const handleEnableInputs = (item) => {
    const newEnables = JSON.parse(JSON.stringify(enableInputs));
    newEnables[item] = !newEnables[item];
    setEnableInputs(newEnables);
  }
  const handleUpdateData = () => {
    if(!dataInput.usuarioOK || !dataInput.correoOK) {
      alert("Asegurese de llenar los campos correctamente!");
      return;
    }
    axios.put("http://localhost:5000/admin_ciudad/usuario",{
      data: {
        username: cookies.get('username'),
        newUsername: dataInput.usuario, 
        pass: cookies.get('password'),
        id: cookies.get('userId'),
        nombre: dataInput.nombre,
        correo: dataInput.correo,
        cargo: dataInput.cargo,
        foto: dataInput.foto
      }
    }).then(res => {
      if(res.data.error) alert("Ha ocurrido un error al intentar actualizar los datos")
      else{
        let expiracion = new Date();
        expiracion.setHours(expiracion.getHours()+6);
        console.log(expiracion)     
        cookies.set("username", dataInput.usuario, {
          path:'/',
          expires: expiracion
        });
        cookies.set("password", cookies.get('password'), {
          path:'/',
          expires: expiracion
        });
        cookies.set("userId", cookies.get('userId'), {
          path:'/',
          expires: expiracion
        });
        cookies.set("userType", cookies.get('userType'), {
          path:'/',
          expires: expiracion
        });
        cookies.set("ciudadId", cookies.get('ciudadId'), {
          path:'/',
          expires: expiracion
        });
        alert("Proceso exitoso!")

      }
    }).catch(err=>{
      alert("Ha ocurrido un error ")
      console.log(err.message)
    })
  }
  const handleOnChangeInput= prop=>evt=>{
    if(prop==="usuario") setDataInput({...dataInput,[prop]:evt.target.value,usuarioOK: userRegExp.test(evt.target.value)});
    else if(prop==="correo") setDataInput({...dataInput,[prop]:evt.target.value,correoOK: mailRegExp.test(evt.target.value)});
    else setDataInput({...dataInput,[prop]: evt.target.value})
  }
  const handleSubmitImage = e => {
    e.preventDefault();
    //agregar algun efecto de carga
    const form = document.getElementById('form');
    const input_image = document.getElementById('input_image');
    if (input_image.value == '') { alert('Por favor carga una imagen!'); return; }
    const formData = new FormData(form);
    let imageId = dataInput.foto
    if (imageId != null) {
      const confirmation = window.confirm("Estas a punto de eliminar la imagen actual para subir una nueva!")
      if (!confirmation) return;
    }
    axios.post('http://localhost:5000/images/uploadAdminCityProfilePhoto', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      const data = res.data;
      console.log(data);
      setDataInput({ ...dataInput, foto: data.id });
      axios.post('http://localhost:5000/admin_ciudad/subirFotoPerfil',{
        data:{
          username: cookies.get('username'),
          pass: cookies.get('password'),
          foto: data.id
        }
      }).then(res => {
        console.log("Imagen actualizada");
        console.log(res.data)
      alert("Imagen subida exitosamente!");
      }).catch(err => {
        console.log("Un error a ocurrido: ", err.message);
        
      alert("Imagen subida exitosamente! Por favor de click en ACEPTAR debajo del formulario");
        return;
      });
      if (imageId != null) {
        axios.delete('http://localhost:5000/images/imagen', {
          data: {
            fileId: imageId
          }
        }).then(res => {
          console.log("Imagen anterior eliminada")
        }).catch(err => {
          console.log("Un error a ocurrido: ", err.message);
          return;
        });
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className='container'>
      <div className='wrapper'>
        <h1 className='title'>DATOS DE ADMINISTRADOR</h1>
        <div className={classes.userImage}>
          <div className={classes.icon} style={dataInput.foto==null?{
            backgroundColor: "black"
          }:{
            backgroundImage: `url("https://drive.google.com/uc?id=${dataInput.foto}")`,
            
            backgroundPosition: "0 0 ",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}>
            {dataInput.foto==null?
            <AccountCircleIcon style={{ fontSize: "200" , margin: "1rem auto"}} />:
            false
            }
          </div>
          <form onSubmit={handleSubmitImage} id='form' encType='multipart/form-data' method='post' className={classes.userImage}>
            <input type='file' name='image' id='input_image'/>
            <input type='text' name='username' value={cookies.get('username')} hidden />
            <input type='text' name='pass' value={cookies.get('password')} hidden />
            <input type='submit' className='boton' value='SUBIR' />
          </form>
        </div>
        <div className={classes.formData}>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              disabled={enableInputs.usuario}
              
              value={dataInput.usuario}
              onChange={handleOnChangeInput("usuario")}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input"
              label="Usuario" />
              <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {dataInput.usuarioOK ? '' : 'Usuario debe contener de 2 a 20 caracteres excepto  @ \" \' <> o espacio '}
            </FormHelperText>
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("usuario")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              onChange={handleOnChangeInput("nombre")}
              value={dataInput.nombre}
              disabled={enableInputs.nombre}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="Nombre" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("nombre")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              onChange={handleOnChangeInput("correo")}
              value={dataInput.correo}
              disabled={enableInputs.correo}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="Correo" />
              <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {dataInput.correoOK ? '' : 'Asegurese de usar una direccion de correo valida '}
            </FormHelperText>
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("correo")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              onChange={handleOnChangeInput("cargo")}
              value={dataInput.cargo}
              disabled={enableInputs.cargo}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="Cargo" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("cargo")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
        </div>
        <button className={"boton " + classes.boton} onClick={handleUpdateData}>ACTUALIZAR</button>
      </div>
    </div>
  )
}

export default UserConfig
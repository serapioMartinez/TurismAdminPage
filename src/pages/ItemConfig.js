import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { FormControl, FormControlLabel, InputLabel, Modal, NativeSelect, Switch, TextField } from '@material-ui/core';
import { makeStyles, Theme, withStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import CssTextField from '../components/CssTextField';
import CstSwitch from '../components/CstSwitch';
import Cookies from 'universal-cookie';
import FormData from 'form-data';
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
})

function ItemConfig() {
  const classes = styles();
  const [enableInputs, setEnableInputs] = useState({
    "nombre": true,
    "descripcion": true,
    "tipoZona": true,
    "dia": true,
    "mes": true,
    "nacimiento": true,
    "fallecimiento": true,
    "telefono": true,
    "correo": true,
    "tipoEstablecimiento": true
  });

  const [datos, setDatos] = useState({
    "nombre": "",
    "descripcion": "",
    "tipoZona": "",
    "dia": 0,
    "mes": 0,
    "nacimiento": '2000-01-01',
    "fallecimiento": '2000-01-01',
    "telefono": '',
    "correo": '',
    "tipoEstablecimiento": 'NT',
    "imagen": null,
    "pro": false
  });

  const handleEnableInputs = (item) => {
    const newEnables = JSON.parse(JSON.stringify(enableInputs));
    newEnables[item] = !newEnables[item];
    setEnableInputs(newEnables);
  }

  const handleChangeInput = (prop) => (evt) => {
    setDatos({ ...datos, [prop]: evt.target.value })
  }
  const handleSubmitImage = e => {
    e.preventDefault();
    //agregar algun efecto de carga
    if(datos.pro){
      alert("No pudes subir una nueva imagen, ya que el establecimiento ya cuenta con un administrador!");
      return;
    }
    const form = document.getElementById('form');
    const input_image = document.getElementById('input_image');
    if (input_image.value == '') { alert('Por favor carga una imagen!'); return; }
    const formData = new FormData(form);
    let imageId = datos.imagen
    if (imageId != null) {
      const confirmation = window.confirm("Estas a punto de eliminar la imagen actual para subir una nueva!")
      if (!confirmation) return;
    }
    axios.post('http://localhost:5000/images/uploadTopicPhoto', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      const data = res.data;
      console.log(data);
      setDatos({ ...datos, imagen: data.id });
      axios.post('http://localhost:5000/admin_ciudad/subirFotoItem',{
        data:{
          username: cookies.get('username'),
          pass: cookies.get('password'),
          id: params.id,
          foto: data.id,
          item: params.item
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
      /*
      axios.post('http://localhost:5000/admin_ciudad/subirRepresentativa',{
        data:{
          username: cookies.get('username'),
          pass: cookies.get('password'),
          imagen: data.id
        }
      }).then(res => {
        console.log("Actualizacion de imagen en DB exitosa");
      }).catch(err => {
        alert("Error actualizando informacion en base de datos! Intente con el boton 'Aceptar'")
        console.log("Error al actualizar imagen en DB");
      })
      */
    })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSubmitData = () => {
    //Ingresar nuevo
    if(params.id == 0){
      if(params.item=="establecimientos"){
        axios.post('http://localhost:5000/admin_ciudad/establecimiento',{
          data: {
            username: cookies.get('username'),
            pass: cookies.get('password'),
            nombre: datos.nombre,
            tipo: datos.tipoEstablecimiento,
            telefono: datos.telefono,
            correo: datos.correo,
            foto: datos.imagen
          }
        }).then(res => {
          const data = res.data;
          if(data.error){
            alert(data.error, ". Por favor intente de nuevo!");
            return;
          }
          alert("Datos subidos con exito!");
        })
        .catch(error => {
          console.log(error.message);
          alert("Ha ocurrido un error. Intelte de nuevo por favor!");
        });
      }
      else{
        let datos_envio={
          username: cookies.get('username'),
          pass: cookies.get('password'),
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          foto: datos.imagen
        };
        switch(params.item){
          case "zonas":
            datos_envio={...datos_envio,
              tipo: datos.tipoZona
            }
            break;
          case "festividades":
            datos_envio={...datos_envio,
              dia: datos.dia,
              mes: datos.mes
            }
            break;
          case "personajes":
            datos_envio={...datos_envio,
              nacimiento: datos.nacimiento,
              fallecimiento: datos.fallecimiento
            }
            break;
        }
        axios.post(`http://localhost:5000/admin_ciudad/${params.item}`,{
          data: datos_envio
        }).then(res => {
          const data = res.data;
          if(data.error){
            alert(data.error, ". Por favor intente de nuevo!");
            return;
          }
          alert("Datos subidos con exito!");
        })
        .catch(error => {
          console.log(error.message);
          alert("Ha ocurrido un error. Intelte de nuevo por favor!");
        });
      }
    }
    //Modificar existente
    else{
      if(params.item=="establecimientos"){
        axios.put('http://localhost:5000/admin_ciudad/establecimiento',{
          data: {
            username: cookies.get('username'),
            pass: cookies.get('password'),
            establecimiento: params.id,
            nombre: datos.nombre,
            tipo: datos.tipoEstablecimiento,
            telefono: datos.telefono,
            correo: datos.correo,
            foto: datos.imagen
          }
        }).then(res => {
          const data = res.data;
          if(data.error){
            alert(data.error, ". Por favor intente de nuevo!");
            return;
          }
          alert("Datos subidos con exito!");
        })
        .catch(error => {
          console.log(error.message);
          alert("Ha ocurrido un error. Intelte de nuevo por favor!");
        });
      }
      else{
        let datos_envio={
          username: cookies.get('username'),
          pass: cookies.get('password'),
          id: params.id,
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          foto: datos.imagen
        };
        switch(params.item){
          case "zonas":
            datos_envio={...datos_envio,
              tipo: datos.tipoZona
            }
            break;
          case "festividades":
            datos_envio={...datos_envio,
              dia: datos.dia,
              mes: datos.mes
            }
            break;
          case "personajes":
            datos_envio={...datos_envio,
              nacimiento: datos.nacimiento,
              fallecimiento: datos.fallecimiento
            }
            break;
        }
        axios.put(`http://localhost:5000/admin_ciudad/${params.item}`,{
          data: datos_envio
        }).then(res => {
          const data = res.data;
          if(data.error){
            alert(data.error, ". Por favor intente de nuevo!");
            return;
          }
          alert("Datos subidos con exito!");
        })
        .catch(error => {
          console.log(error.message);
          alert("Ha ocurrido un error. Intelte de nuevo por favor!");
        });
      }
    }
    
  }
  const params = useParams();
  useEffect(() => {
    if(params.id ==0) return;
    if(params.item=="establecimientos"){
      axios.get(`http://localhost:5000/no_users/establecimientos/${params.id}/${cookies.get('ciudadId')}`)
      .then(res => {
        const data = res.data;
        console.log(data)
        if(data.error){
          alert("Un error ha ocurrido: ", res.error);
          console.log(res.error);
          return;
        }
        setDatos({
          ...datos,
          nombre: data.NOMBRE,
          descripcion:data.DESCRIPCION,
          tipoEstablecimiento: data.TIPO,
          telefono: data.TELEFONO,
          correo: data.CORREO,
          imagen: data.FOTO,
          pro: data.PRO
        })
      })
      .catch(error => {
        console.log(error.message)
        console.log("Ha ocurrido un error interno en la requision de esta pagina");
        alert("Error al tratar de obtener los datos, por favor recargue.")
      });
    }else{
      axios.get(`http://localhost:5000/no_users/item/${params.item}/${params.id}`)
      .then(res => {
        const data = res.data[0];
        console.log(data)
        if( data.error){
          return;
        }
        switch(params.item){
          case "platillos":
            setDatos({...datos, nombre: data.NOMBRE, descripcion: data.DESCRIPCION, imagen: data.FOTO})
            break;
          case "zonas":
            setDatos({...datos, nombre: data.NOMBRE, tipoZona: data.TIPO, descripcion: data.DESCRIPCION, imagen: data.FOTO});
            break;
          case "festividades":
            setDatos({...datos,nombre: data.NOMBRE, dia: data.DIA, mes: data.MES, descripcion: data.DESCRIPCION, imagen: data.FOTO});
            break;
          case "personajes":
            setDatos({...datos, nombre: data.NOMBRE,nacimiento: data.NACIMIENTO, fallecimiento: data.FALLECIMIENTO, descripcion: data.DESCRIPCION, imagen: data.FOTO});
            break;
          case "notas":
            setDatos({...datos, nombre: data.TITULO, descripcion: data.DESCRIPCION, imagen: data.FOTO});
            break;
        }
      }).catch(err => {
        console.log(err.message);
        alert("Un error ha ocurrido, recargue la pagina por favor!");
      })
    }
  }, []);

  return (
    <div className='container'>
      <div className='wrapper'>
        <h1 className='title'>{params.item.toUpperCase() + " -> ID: " + params.id}</h1>
        <div className={classes.userImage}>
          <div className={classes.imageContainer} style={datos.imagen==null?{
            backgroundColor: "greenyellow"
          }:{
            backgroundImage: `url("https://drive.google.com/uc?id=${datos.imagen}")`,
            
            backgroundPosition: "0 0 ",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}>
            {/*
            {datos.imagen == null ? <span>IMAGEN</span> : (
              <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={`https://drive.google.com/uc?id=${datos.imagen}`} />
            )}
            */}
          </div>
          <form onSubmit={handleSubmitImage} id='form' encType='multipart/form-data' method='post' className={classes.userImage}>
            <input type='file' name='image' id='input_image' style={{width: "100%"}}/>
            <input type='text' name='username' value={cookies.get('username')} hidden />
            <input type='text' name='pass' value={cookies.get('password')} hidden />
            <input type='submit' className='boton' value='SUBIR' />
          </form>
        </div>
        <div className={classes.formData}>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              required
              value={datos.nombre}
              onChange={handleChangeInput('nombre')}
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

          {params.item === 'establecimientos' ? (
            <>
            <div className={classes.input}>
              <AccountCircleIcon className={classes.iconInput} />
              <FormControlLabel
                control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("tipoEstablecimiento")} />}
                label="Editar"
                className={classes.switch}
              />
              <FormControl className={classes.formControl}>
                <InputLabel style={{ color: "white" }}>Tipo de establecimiento</InputLabel>
                <NativeSelect
                  value={datos.tipoEstablecimiento}
                  onChange={handleChangeInput('tipoEstablecimiento')}
                  id='userType'
                  disabled={enableInputs.tipoEstablecimiento}
                  style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                  <option style={{ backgroundColor: "black" }} value="NT">NO HAY TIPO</option>
                  <option style={{ backgroundColor: "black" }} value="RS">RESTANURANTE</option>
                  <option style={{ backgroundColor: "black" }} value="HT">HOTEL</option>
                  <option style={{ backgroundColor: "black" }} value="TR">TRANSPORTE</option>
                  <option style={{ backgroundColor: "black" }} value="MR">MERCADO</option>
                  <option style={{ backgroundColor: "black" }} value="BN">BANCO</option>
                  <option style={{ backgroundColor: "black" }} value="GB">GOBIERNO</option>
                  <option style={{ backgroundColor: "black" }} value="SP">SUPERMERCADO</option>
                  <option style={{ backgroundColor: "black" }} value="AB">ABARROTES</option>

                </NativeSelect>

              </FormControl>
            </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.telefono}
                  onChange={handleChangeInput('telefono')}
                  disabled={enableInputs.telefono}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Telefono" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("telefono")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.correo}
                  onChange={handleChangeInput('correo')}
                  disabled={enableInputs.correo}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Correo" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("correo")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
            </>
          ) : false}

          {params.item == 'zonas' ? (
            <div className={classes.input}>
              <AccountCircleIcon className={classes.iconInput} />
              <FormControlLabel
                control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("tipoZona")} />}
                label="Editar"
                className={classes.switch}
              />
              <FormControl className={classes.formControl}>
                <InputLabel style={{ color: "white" }}>Tipo de zona (turismo)</InputLabel>
                <NativeSelect
                  value={datos.tipoZona}
                  onChange={handleChangeInput('tipoZona')}
                  id='userType'
                  disabled={enableInputs.tipoZona}
                  style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                  <option style={{ backgroundColor: "black" }} value="AV">AVENTURA</option>
                  <option style={{ backgroundColor: "black" }} value="DP">DEPORTE</option>
                  <option style={{ backgroundColor: "black" }} value="NG">NEGOCIOS</option>
                  <option style={{ backgroundColor: "black" }} value="CL">CULTURAL</option>
                  <option style={{ backgroundColor: "black" }} value="GS">GASTRONOMICO</option>
                  <option style={{ backgroundColor: "black" }} value="AQ">ARQUEOLICO</option>
                  <option style={{ backgroundColor: "black" }} value="SL">SALUD</option>
                  <option style={{ backgroundColor: "black" }} value="RL">RURAL</option>
                  <option style={{ backgroundColor: "black" }} value="EC">ECOLOGICO</option>
                  <option style={{ backgroundColor: "black" }} value="ES">ESPIRITUAL</option>

                </NativeSelect>

              </FormControl>
            </div>
          ) : false}
          {params.item == 'festividades' ? (
            <>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.dia}
                  onChange={handleChangeInput('dia')}
                  disabled={enableInputs.dia}
                  className={classes.margin}
                  type="number"
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Dia" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("dia")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.mes}
                  onChange={handleChangeInput('mes')}
                  type='number'
                  disabled={enableInputs.mes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Mes" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("mes")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
            </>
          ) : false}
          {params.item == 'personajes' ? (
            <>

              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.nacimiento}
                  onChange={handleChangeInput('nacimiento')}
                  disabled={enableInputs.nacimiento}
                  className={classes.margin}
                  type="date"
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Nacimiento" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("nacimiento")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField

                  value={datos.fallecimiento}
                  onChange={handleChangeInput('fallecimiento')}
                  disabled={enableInputs.fallecimiento}
                  className={classes.margin}
                  type="date"
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Fallecimiento" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("fallecimiento")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
            </>
          ) : false}
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              multiline
              value={datos.descripcion}
              onChange={handleChangeInput('descripcion')}
              disabled={enableInputs.descripcion}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="Descripcion" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("descripcion")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
        </div>
        <button className={"boton " + classes.boton} onClick={() => (datos.pro)?alert("No puedes actualizar ya que el establecimiento ya cuenta con un administrador"):handleSubmitData()}>ACEPTAR</button>
      </div>
    </div>
  )
}

export default ItemConfig;
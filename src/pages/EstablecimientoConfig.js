import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { FormControl, FormControlLabel, FormHelperText, InputLabel, NativeSelect, Switch, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles, withStyles } from '@material-ui/core';
import CstSwitch from '../components/CstSwitch';
import CssTextField from '../components/CssTextField';
import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoReact from '../logo.svg'

const cookie = new Cookies();
const endpoint = "http://localhost:5000/admin_establecimiento";

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
  formControl: {
    width: "100%",
    margin: "1rem 1rem 0 1rem"
  },
  containerSelection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  selection: {
    position: "relative",
    backgroundColor: "#624C4C",
    borderRadius: "10px",
    padding: "0 0.7rem",
    marginTop: "1rem"

  },
  closeIcon: {
    fontSize: "25px",
    position: "absolute",
    color: "red",
    top: "-5px",
    right: "-5px",
    "&:hover": {
      cursor: "pointer"
    }
  },
  formData: {
    width: "100%",
    minWidth: "20rem",
    maxWidth: "30rem",
    padding: " 0.5rem 1rem"

  },
  galeryContainer: {
    boxSizing: "border-box",
    position: "relative",
    display: "flex",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: "1.5rem",
    marginBottom: "2rem"
  },
  galery: {
    position: "relative",
    width: "8rem",
    height: "8rem",
    backgroundColor: "#fff",
    borderRadius: "10px",
    margin: "2.5rem 1rem"
  }
})

function EstablecimientoConfig() {
  const mailRegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  const phoneRegexp = /^[0-9]{10}$/;
  const classes = styles();

  const [maxImages, setMaxImages]=useState(5);

  const navigate = useNavigate();
  const [loaders, setLoaders] = useState({
    galeria: false,
    representativa: false,
    form: false,
    body: true,
  })
  const [fotos, setFotos] = useState([]);
  const [ciudades, setCiudades] = useState([{ ID: 0, CIUDAD: "NO CITY" }]);
  const [enableInputs, setEnableInputs] = useState({
    "nombre": true,
    "tipoEstablecimiento": true,
    "telefono": true,
    "correo": true,
    "paginaWeb": true,
    "tiposPago": true,
    "descripcion": true,
    "ciudad": true,
    "colonia": true,
    "numero": true,
    "cp": true,
    "calle": true
  });
  const [datos, setDatos] = useState({
    "establecimiento": cookie.get('establecimientoId'),
    "nombre": "",
    "tipoEstablecimiento": "NT",
    "telefono": "",
    "correo": "",
    "paginaWeb": "",
    "tiposPago": "",
    "descripcion": "",
    "ciudad": "0",
    "colonia": "",
    "numero": "",
    "cp": "",
    "calle": "",
    "foto": null,
    "correoOK": true,
    'telefonoOK': true,
  });


  const submitData = () => {
    if (cookie.get('establecimientoId') == "null") {
      axios.post(`${endpoint}/establecimiento`, {
        data: {
          username: cookie.get('username'),
          pass: cookie.get('password'),
          nombre: datos.nombre,
          correo: datos.correo,
          telefono: datos.telefono,
          tipo: datos.tipoEstablecimiento,
          ciudad: datos.ciudad,
          colonia: datos.colonia,
          numero: datos.numero,
          cp: datos.cp,
          calle: datos.calle,
          pagina: datos.paginaWeb,
          maps: "",
          descripcion: datos.descripcion

        }
      }).then(res => {
        const data = res.data;
        if (data.error) {
          console.log(data.error);
          alert("Ha ocurrido un error al intentar actualizar")
        } else {
          console.log(data)
          cookie.set('establecimientoId', data[0].ID, { path: '/' })
          alert("Proceso exitoso");
          navigate('/establecimiento/inicio')

        }
      }).catch(err => {
        console.log(err.message)
        alert("Ha ocurrido un error")
      })
    } else {
      axios.put(`${endpoint}/establecimiento`, {
        data: {
          username: cookie.get('username'),
          pass: cookie.get('password'),
          establecimiento: cookie.get('establecimientoId'),
          nombre: datos.nombre,
          correo: datos.correo,
          telefono: datos.telefono,
          tipo: datos.tipoEstablecimiento,
          pagina: datos.paginaWeb,
          maps: "",
          descripcion: datos.descripcion
        }
      }).then(res => {
        const data = res.data;
        if (data.error) {
          console.log(data.error);
          alert("Ha ocurrido un error al intentar actualizar")
        } else {
          console.log(data)
          alert("Proceso exitoso");
          navigate('/establecimiento/inicio')
        }

      }).catch(err => {
        console.log(err.message)
        alert("Ha ocurrido un error")
      })
    }
  }

  const handleEnableInputs = (item) => {
    const newEnables = JSON.parse(JSON.stringify(enableInputs));
    newEnables[item] = !newEnables[item];
    setEnableInputs(newEnables);
  }

  const handleOnChangeInput = (prop) => (evt) => {
    if (prop == "correo") setDatos({
      ...datos,
      [prop]: evt.target.value, correoOK: mailRegExp.test(evt.target.value)
    })
    else if (prop == 'telefono') setDatos({
      ...datos,
      [prop]: evt.target.value, telefonoOK: phoneRegexp.test(evt.target.value)
    })
    else setDatos({ ...datos, [prop]: evt.target.value })
  }

  const handleSubmitImage = e => {
    e.preventDefault();
    if (datos.establecimiento == 'null') {
      alert('Primero crea tu establecimiento!');
      return;
    }
    //agregar algun efecto de carga
    const form = document.getElementById('form');
    const input_image = document.getElementById('input_image');
    if (input_image.value == '') { alert('Por favor carga una imagen!'); return; }
    const formData = new FormData(form);
    let imageId = datos.foto
    if (imageId != null) {
      const confirmation = window.confirm("Estas a punto de eliminar la imagen actual para subir una nueva!")
      if (!confirmation) return;
    }
    axios.post('http://localhost:5000/images/uploadRepresentativaEstablecimiento', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      const returned = res.data;
      console.log(returned);
      setDatos({ ...datos, foto: returned.id });

      axios.post('http://localhost:5000/admin_establecimiento/subirRepresentativa', {
        data: {
          username: cookie.get('username'),
          pass: cookie.get('password'),
          foto: returned.id,
          establecimiento: cookie.get('establecimientoId')
        }
      }).then(resp => {
        if (resp.data.error) {
          alert(resp.data.error);
          return
        }
        console.log("Imagen actualizada");
        console.log(resp.data)
      }).catch(err => {
        console.log("Un error a ocurrido: ", err.message);
        return;
      });
      if (imageId != null) {
        handleDeleteImage(imageId)
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSubmitMultipleImages = e => {
    e.preventDefault();
    if (datos.establecimiento == 'null') {
      alert('Primero crea tu establecimiento!');
      return;
    }
    setLoaders({...loaders,galeria: true})
    const input = document.getElementById('images');
    const numFiles = input.files.length; 
    if(numFiles>maxImages){
      alert(`Solo puedes subir 5 imagenes. Ya cuentas con ${5-maxImages}. \n\t${maxImages} cupos disponibles`)
      
    setLoaders({...loaders,galeria: false})
      return;
    }
    if(numFiles==0){
      alert("Asegurate de escoger una imagen");
      
    setLoaders({...loaders,galeria: false})
      return;
    }
    const form = document.getElementById('multiple_form');
    const formData = new FormData(form);
    axios.post('http://localhost:5000/images/uploadEstablishmentPhotos', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      const returned = res.data;
      console.log(returned);
      if(returned.error){
        alert("Un error ha ocurrido, intenete de nuevo mas tarde!")
        setLoaders({...loaders,galeria: false})
        return;

      }
      let aux_fotos =[];
      returned.forEach(element => {
        aux_fotos.push({
          FOTO: element.id
        })
      });
      setFotos([...fotos,...aux_fotos])

      axios.post('http://localhost:5000/admin_establecimiento/insertarFotos', {
        data: {
          username: cookie.get('username'),
          pass: cookie.get('password'),
          images_data: aux_fotos,
          establecimiento: datos.establecimiento
        }
      }).then(resp => {
        if (resp.data.error) {
          alert(resp.data.error);
          return
        }
        setMaxImages(maxImages-numFiles);
        console.log("Galeria actualizada");
        console.log(resp.data)
      }).catch(err => {
        console.log("Un error a ocurrido: ", err.message);
        alert('Un error ha ocurrido, intente de nuevo mas tarde!');
        return;
      }).finally(()=>{
        
    setLoaders({...loaders,galeria: false})
      });
    })
      .catch((err) => {
        console.log(err);
        alert('Un error ha ocurrido, intente de nuevo mas tarde!');
      }).finally(()=>{
        
    setLoaders({...loaders,galeria: false})
      });
  }
  const handleDeleteImage= id => {
    axios.delete('http://localhost:5000/images/imagen', {
          data: {
            fileId: id
          }
        }).then(res => {
          console.log("Imagen eliminada")
        }).catch(err => {
          console.log("Un error a ocurrido: ", err.message);
          return;
        });
  }
  useEffect(() => {
    if (datos.establecimiento == 'null') {
      axios.get('http://localhost:5000/no_users/listarCiudades').then(
        res => {
          const data = res.data;
          setCiudades([...data])
        }
      ).catch(err => {
        console.log(err.message)
      });
      return
    }

    axios.get(`http://localhost:5000/no_users/establecimientos/${cookie.get('establecimientoId')}/0`)
      .then(res => {
        const data = res.data;
        console.log(data)
        setDatos({
          ...datos,
          nombre: data.NOMBRE,
          correo: data.CORREO,
          telefono: data.TELEFONO,
          tipoEstablecimiento: data.TIPO,
          descripcion: data.DESCRIPCION,
          foto: data.FOTO,
          paginaWeb: data.WEB
        })
      }).catch(err => {
        console.log("Error: ", err.message);
        alert("Ha ocurrido un error al intentar obtener los datos de la ciudad administrada. ¡Por favor recargue la pagina!")
      });
    axios.get('http://localhost:5000/no_users/galeria',{
      params:{
        id: datos.establecimiento,
        tipo: "ESTABLECIMIENTO"
      }
    }).then(res => {
      const data = res.data;
      if(data.error){
        console.log(data.error);
        alert(data.error);
        return;
      }
      console.log(data)
      setMaxImages(maxImages-data.length);
      setFotos([...data]);
    }).catch(err => {
      console.log("Error: ", err.message);
      alert("Ha ocurrido un error al intentar obtener los datos de la ciudad administrada. ¡Por favor recargue la pagina!")
    })
  }, []);

  return (
    <div className='container'>
      <div className='wrapper'>
        <h1 className='title'>DATOS DE ESTABLECIMIENTO</h1>
        <div className={classes.galeryContainer}>

          {
            loaders.galeria?
            <img src={logoReact} className='App-logo' style={{width: "150px"}}/>:
            (
              fotos.length==0?
            <div>
              <h2>AUN NO CUENTAS CON IMAGENES EN TU GALERIA</h2>
            </div>:
            fotos.map( foto => 
              <div className={classes.galery} style={{
                backgroundImage: `url("https://drive.google.com/uc?id=${foto.FOTO}")`,
                backgroundPosition: "0 0 ",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
              }}>
                <CancelIcon className={classes.closeIcon} onClick={() => {
                  if(!window.confirm('¿Desea eliminar esta imagen?'))return;
                  const index = fotos.indexOf(foto)
                  handleDeleteImage(foto.FOTO)
                  axios.delete(`${endpoint}/foto`,{
                    data:{
                      data:{
                        username: cookie.get('username'),
                        pass: cookie.get('password'),
                        id: foto.FOTO
                      }
                    }
                  }).then(res => {
                    if(res.data.error){
                      console.log(res.data.error)
                      alert(res.data.error)
                    }
                    let newFotos = [...fotos];
                    newFotos.splice(index,1);
                    setMaxImages(maxImages+1)
                    setFotos([...newFotos])
                  }).catch(err => {
                    console.log(err.message);
                    alert("Ha ocurrido un error, intente de nuevo mas tarde!");
                  })
                  
                }}/>
              </div>
            )
            )
          }

          <form onSubmit={handleSubmitMultipleImages} id='multiple_form' style={{ width: "100%" }} encType='multipart/form-data' method='post' className={classes.userImage}>
            <input multiple type='file' id='images' name='images' style={{ width: "auto" }} />
            <input type='text' name='username' value={cookie.get('username')} hidden />
            <input type='text' name='pass' value={cookie.get('password')} hidden />
            <input type='submit' className='boton' value='CAMBIAR FOTOS'/>
          </form>

        </div>
        <div className={classes.userImage}>


          <div className={classes.imageContainer} style={datos.foto == null ? {
            backgroundColor: "greenyellow"
          } : {
            backgroundImage: `url("https://drive.google.com/uc?id=${datos.foto}")`,

            backgroundPosition: "0 0 ",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}>
          </div>
          <form onSubmit={handleSubmitImage} id='form' encType='multipart/form-data' method='post' className={classes.userImage}>
            <input type='file' name='image' id='input_image' style={{ width: "100%" }} />
            <input type='text' name='username' value={cookie.get('username')} hidden />
            <input type='text' name='pass' value={cookie.get('password')} hidden />
            <input type='submit' className='boton' value='SUBIR' />
          </form>
        </div>
        <div className={classes.formData}>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              value={datos.nombre}
              onChange={handleOnChangeInput('nombre')}
              disabled={enableInputs.nombre}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input"
              label="NOMBRE" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("nombre")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              value={datos.telefono}
              onChange={handleOnChangeInput('telefono')}
              disabled={enableInputs.telefono}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input"
              label="TELEFONO" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("telefono")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.telefonoOK ? '' : 'Formato de numero telefonico invalido'}
            </FormHelperText>
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              value={datos.correo}
              onChange={handleOnChangeInput('correo')}
              disabled={enableInputs.correo}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input"
              label="CORREO" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("correo")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.correoOK ? '' : 'Correo invalido'}
            </FormHelperText>
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("tipoEstablecimiento")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormControl className={classes.formControl}>
              <InputLabel style={{ color: "white" }}>TIPO ESTABLECIMIENTO</InputLabel>
              <NativeSelect
                id='userType'
                value={datos.tipoEstablecimiento}
                onChange={handleOnChangeInput('tipoEstablecimiento')}
                disabled={enableInputs.tipoEstablecimiento}
                style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                <option style={{ backgroundColor: "black" }}>Elegir</option>
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
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              value={datos.paginaWeb}
              onChange={handleOnChangeInput('paginaWeb')}
              disabled={enableInputs.paginaWeb}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="PAGINA WEB" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("paginaWeb")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.telefonoOK ? '' : 'Numero telefonico invalido'}
            </FormHelperText>
          </div>

          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              multiline
              value={datos.descripcion}
              onChange={handleOnChangeInput('descripcion')}
              disabled={enableInputs.descripcion}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="DESCRIPCION" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("descripcion")} />}
              label="Editar"
              className={classes.switch}
            />
          </div>
          {(datos.establecimiento == 'null') ? (
            <>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("ciudad")} />}
                  label="Editar"
                  className={classes.switch}
                />
                <FormControl className={classes.formControl}>
                  <InputLabel style={{ color: "white" }}>CIUDAD: </InputLabel>
                  <NativeSelect
                    id='ciudad'
                    value={datos.ciudad}
                    onChange={handleOnChangeInput('ciudad')}
                    disabled={enableInputs.ciudad}
                    style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                    <option style={{ backgroundColor: "black" }} value='0'>Elegir</option>
                    {ciudades.map(ciudad => {
                      return <option key={ciudad.ID} style={{ backgroundColor: "black" }} value={ciudad.ID}>{ciudad.CIUDAD}</option>
                    })}

                  </NativeSelect>

                </FormControl>
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.colonia}
                  onChange={handleOnChangeInput('colonia')}
                  disabled={enableInputs.colonia}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="COLONIA" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("colonia")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.calle}
                  onChange={handleOnChangeInput('calle')}
                  disabled={enableInputs.calle}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="CALLE" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("calle")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.numero}
                  onChange={handleOnChangeInput('numero')}
                  disabled={enableInputs.numero}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="NUMERO" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("numero")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  value={datos.cp}
                  onChange={handleOnChangeInput('cp')}
                  disabled={enableInputs.cp}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="CODIGO POSTAL" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("cp")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
            </>) : false}
        </div>

        <button className={"boton " + classes.boton} onClick={submitData}>ACEPTAR</button>
      </div>
    </div>
  )
}

export default EstablecimientoConfig;
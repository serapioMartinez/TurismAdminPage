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
import logoReact from '../logo.svg';
const cookie = new Cookies();
const endpoint = "http://localhost:5000/admin_ciudad";

const tiposTurismo = {
  "NT":"NO HAY TIPO",
  "AV":"AVENTURA",
  "DP":"DEPORTE",
  "NG":"NEGOCIOS",
  "CL":"CULTURAL",
  "GS":"GASTRONOMICO",
  "AQ":"ARQUEOLICO",
  "SL":"SALUD",
  "RL":"RURAL",
  "EC":"ECOLOGICO",
  "ES":"ESPIRITUAL"

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
  containerSelection:{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  selection:{
    position: "relative",
    backgroundColor: "#624C4C",
    borderRadius: "10px",
    padding: "0 0.7rem",
    marginTop: "1rem"
  
  },
  closeIcon:{
    position: "absolute",
    top: "-5px",
    right: "-5px",
    fontSize: "15px",
    backgroundColor: "red",
    borderRadius: "50%",
    "&:hover":{
      cursor: "pointer",
      fontSize: "17px"
    }
  },
  formData:{
    width: "100%",
    minWidth: "20rem",
    maxWidth: "30rem",
    padding: " 0.5rem 1rem"

  },
  galeryContainer:{
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

function CiudadConfig() {
  const mailRegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  const phoneRegexp = /^[0-9]{10}$/;
  const classes = styles();
  const location = useLocation();
  const navigate = useNavigate();
  const [maxImages, setMaxImages]=useState(5);
  const [loaders, setLoaders] = useState({
    galeria: false,
    representativa: false,
    form: false,
    body: true,
  })
  const [fotos, setFotos] = useState([]);
  const { ciudad } = location.state;
  const [enableInputs, setEnableInputs] = useState({
    "ciudad": true,
    "municipio": true,
    "region": true,
    "telefono": true,
    "correo": true,
    "magico": true,
    "tipos": true,
    "emergencias": true,
    "descripcion": true,
  });
  const [datos, setDatos] = useState({
    "ciudad": '',
    "municipio": '',
    "region": '',
    "telefono": '',
    "correo": '',
    "magico": '',
    "emergencias": '',
    "descripcion": '',
    "foto": null,
    'tipos': ["NT"],
    "correoOK": true,
    'telefonoOK': true,
    'emergenciasOK': true
  });

  const castTipos = (cad_tipos) => {
    var arreglo = [];
    for (let i = 0; i < cad_tipos.length / 2; i++) {
      console.log(cad_tipos.substring(i * 2, (i * 2) + 2))
      arreglo.push(cad_tipos.substring(i * 2, (i * 2) + 2));
    }
    return arreglo;
  }
  const uncastTipos = () => {
    var cad = "";
    datos.tipos.forEach(element => {
      cad += element;
    });
    console.log(cad)
    return cad;
  }

  const submitData = () => {
    console.log(typeof (cookie.get('ciudadId')))
    if (cookie.get('ciudadId') === "null") {
      axios.post("http://localhost:5000/admin_ciudad/ciudad", {
        data: {
          username: cookie.get('username'),
          pass: cookie.get('password'),
          ciudad: datos.ciudad,
          region: datos.region,
          municipio: datos.municipio,
          correo: datos.correo,
          telefono: datos.telefono,
          magico: datos.magico,
          tipos: uncastTipos(),
          emergencias: datos.emergencias,
          descripcion: datos.descripcion
        }
      }).then(res => {
        const data = res.data;
        if (data.error) {
          console.log(data.error);
          alert("Ha ocurrido un error al intentar actualizar")
        } else {
          console.log(data)
          if (data[0].existencia) { alert("Tu ya administrar una ciudad"); navigate('/ciudad/inicio') }
          else {
            cookie.set('ciudadId', data[0][0].ID, { path: '/' })
            alert("Proceso exitoso");
            navigate('/ciudad/inicio')
          }
        }
      }).catch(err => {
        console.log(err.message)
        alert("Ha ocurrido un error")
      })
    } else {
      axios.put("http://localhost:5000/admin_ciudad/ciudad", {
        data: {
          username: cookie.get('username'),
          pass: cookie.get('password'),
          correo: datos.correo,
          telefono: datos.telefono,
          magico: datos.magico,
          tipos: "AV",
          emergencias: datos.emergencias,
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
          navigate('/ciudad/inicio')
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
    if (prop === "correo") setDatos({
      ...datos,
      [prop]: evt.target.value, correoOK: mailRegExp.test(evt.target.value)
    })
    else if (prop === 'telefono') setDatos({
      ...datos,
      [prop]: evt.target.value, telefonoOK: phoneRegexp.test(evt.target.value)
    })
    else if (prop === 'emergencias') setDatos({
      ...datos,
      [prop]: evt.target.value, emergenciasOK: phoneRegexp.test(evt.target.value)
    })
    else if (prop === 'tipos') {
      if(datos.tipos.find( tipo => tipo === evt.target.value)) return;
      if(datos.tipos.find( tipo => tipo === "NT"))  setDatos({ ...datos, [prop]: [evt.target.value] })
      else setDatos({ ...datos, [prop]: [...datos.tipos,evt.target.value] })
    }
    else setDatos({ ...datos, [prop]: evt.target.value })
  }
  const handleDeleteTipo = (prop) => {
    const newTipos = datos.tipos;
    newTipos.pop(prop); 
    if(newTipos.length==0) newTipos.push("NT");
    setDatos({...datos,tipos: newTipos});
  }
  const handleSubmitImage = e => {
    e.preventDefault();
    
    //agregar algun efecto de carga
    if(ciudad=='null'){
      alert("Primero crea el establecimiento por favor!");
      return;
    }
    if(datos.pro){
      alert("No pudes subir una nueva imagen, ya que el establecimiento ya cuenta con un administrador!");
      return;
    }
    const form = document.getElementById('form');
    const input_image = document.getElementById('input_image');
    if (input_image.value == '') { alert('Por favor carga una imagen!'); return; }
    const formData = new FormData(form);
    let imageId = datos.foto
    if (imageId != null) {
      const confirmation = window.confirm("Estas a punto de eliminar la imagen actual para subir una nueva!")
      if (!confirmation) return;
    }
    axios.post('http://localhost:5000/images/uploadRepresentativaCiudad', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      const data = res.data;
      console.log(data);
      setDatos({ ...datos, foto: data.id });
      axios.post('http://localhost:5000/admin_ciudad/subirRepresentativa',{
        data:{
          username: cookie.get('username'),
          pass: cookie.get('password'),
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
  const handleSubmitMultipleImages = e => {
    e.preventDefault();
    if(ciudad=='null'){
      alert("Primero crea el establecimiento por favor!");
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
    axios.post('http://localhost:5000/images/uploadCityPhotos', formData, {
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

      axios.post(`${endpoint}/insertarFotos`, {
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
  useEffect(()=>{
    if(ciudad=='null') return;
    axios.get(`http://localhost:5000/no_users/lugares/${ciudad}`)
            .then(res => {
                const data = res.data;
                console.log(data)
                setDatos({...datos,
                    nombre: data.NOMBRE,
                    region: data.REGION,
                    municipio: data.MUNICIPIO,
                    correo: data.CORREO,
                    telefono: data.TELEFONO,
                    magico: data.MAGICO,
                    tipos: castTipos(data.TIPOS),
                    emergencias: data.EMERGENCIAS,
                    calificacion: data.CALIFICACION,
                    descripcion: data.DESCRIPCION,
                    foto: data.FOTO
                })
            }).catch(err=>{
                console.log("Error: ",err.message);
                alert("Ha ocurrido un error al intentar obtener los datos de la ciudad administrada. ??Por favor recargue la pagina!")
            });
            axios.get('http://localhost:5000/no_users/galeria',{
              params:{
                id: ciudad,
                tipo: "CIUDAD"
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
              alert("Ha ocurrido un error al intentar obtener los datos de la ciudad administrada. ??Por favor recargue la pagina!")
            })
  },[]);
  return (
    <div className='container'>
      <div className='wrapper'>
        <h1 className='title'>DATOS DE CIUDAD</h1>
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
                  if(!window.confirm('??Desea eliminar esta imagen?'))return;
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
          <form onSubmit={handleSubmitMultipleImages} style={{width: "100%"}} id='multiple_form' encType='multipart/form-data' method='post' className={classes.userImage}>
            <input multiple type='file' name='images' id='images' style={{width: "auto"}}/>
            <input type='text' name='username' value={cookie.get('username')} hidden />
            <input type='text' name='pass' value={cookie.get('password')} hidden />
            <input type='submit' className='boton' value='CAMBIAR FOTOS' />
          </form>
         
        </div>
        <div className={classes.userImage}>
          
          
          <div className={classes.imageContainer} style={datos.foto==null?{
            backgroundColor: "greenyellow"
          }:{
            backgroundImage: `url("https://drive.google.com/uc?id=${datos.foto}")`,
            
            backgroundPosition: "0 0 ",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}>
            </div>
          <form onSubmit={handleSubmitImage} id='form' encType='multipart/form-data' method='post' className={classes.userImage}>
            <input type='file' name='image' id='input_image' style={{width: "100%"}}/>
            <input type='text' name='username' value={cookie.get('username')} hidden />
            <input type='text' name='pass' value={cookie.get('password')} hidden />
            <input type='submit' className='boton' value='SUBIR' />
          </form>
        </div>
        <div className={classes.formData}>
          {cookie.get('ciudadId') === "null" ? (
            <div className={classes.input}>
              <AccountCircleIcon className={classes.iconInput} />
              <CssTextField
                value={datos.ciudad}
                onChange={handleOnChangeInput('ciudad')}
                disabled={enableInputs.ciudad}
                className={classes.margin}
                style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                id="custom-css-standard-input"
                label="CIUDAD" />
              <FormControlLabel
                control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("ciudad")} />}
                label="Editar"
                className={classes.switch}
              />
            </div>
          ) : <></>}
          {cookie.get('ciudadId') === "null" ? (
            <div className={classes.input}>
              <AccountCircleIcon className={classes.iconInput} />
              <CssTextField
                value={datos.municipio}
                onChange={handleOnChangeInput('municipio')}
                disabled={enableInputs.municipio}
                className={classes.margin}
                style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                id="custom-css-standard-input"
                label="MUNICIPIO" />
              <FormControlLabel
                control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("municipio")} />}
                label="Editar"
                className={classes.switch}
              />
            </div>
          ) : <></>}
          {cookie.get('ciudadId') === "null" ? (
            <div className={classes.input}>
              <AccountCircleIcon className={classes.iconInput} />
              <FormControlLabel
                control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("region")} />}
                label="Editar"
                className={classes.switch}
              />
              <FormControl className={classes.formControl}>
                <InputLabel style={{ color: "white" }}>REGION</InputLabel>
                <NativeSelect
                  id='userType'
                  value={datos.region}
                  onChange={handleOnChangeInput('region')}
                  disabled={enableInputs.region}
                  style={{color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                  <option style={{ backgroundColor: "black" }}>Elegir</option>
                  <option style={{ backgroundColor: "black" }} value="CN">CA??ADA</option>
                  <option style={{ backgroundColor: "black" }} value="CT">COSTA</option>
                  <option style={{ backgroundColor: "black" }} value="IT">ITSMO</option>
                  <option style={{ backgroundColor: "black" }} value="MX">MIXTECA</option>
                  <option style={{ backgroundColor: "black" }} value="PP">PAPALOAPAN</option>
                  <option style={{ backgroundColor: "black" }} value="SS">SIERRA SUR</option>
                  <option style={{ backgroundColor: "black" }} value="SN">SIERRA NORTE</option>
                  <option style={{ backgroundColor: "black" }} value="VC">VALLES CENTRALES</option>

                </NativeSelect>

              </FormControl>
            </div>
          ) : <></>}
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              value={datos.telefono}
              onChange={handleOnChangeInput('telefono')}
              disabled={enableInputs.telefono}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="TELEFONO" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("telefono")} />}
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
              value={datos.correo}
              onChange={handleOnChangeInput('correo')}
              disabled={enableInputs.correo}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width:"90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="CORREO" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("correo")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.correoOK ? '' : 'Direccion de correo invalido'}
            </FormHelperText>
          </div>
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("magico")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormControl className={classes.formControl}>
              <InputLabel style={{ color: "white" }}>MAGICO</InputLabel>
              <NativeSelect
                id='userType'
                value={datos.magico}
                onChange={handleOnChangeInput('magico')}
                disabled={enableInputs.magico}
                style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                <option style={{ backgroundColor: "black" }} value={1}>SI</option>
                <option style={{ backgroundColor: "black" }} value={0}>NO</option>

              </NativeSelect>

            </FormControl>
          </div>
          
          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("tipos")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormControl className={classes.formControl}>
              <InputLabel required style={{ color: "white" }}>TIPOS DE TURISMO</InputLabel>
              <NativeSelect
                id='userType'
                multiple
                value={datos.tipos[datos.tipos.length-1]}
                onChange={handleOnChangeInput('tipos')}
                disabled={enableInputs.tipos}
                style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                <option style={{ backgroundColor: "black" }} value="NT">NO HAY TIPO</option>
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
            <div className={classes.containerSelection}>
              {datos.tipos.map( tipo => {
                return (
                <div className={classes.selection}>
                  <span>{tiposTurismo[tipo]}</span>
                  <CancelIcon className={classes.closeIcon} onClick={()=> handleDeleteTipo(tipo)}/>
                </div>
                )
              }
              )
              }
            </div>
          </div>

          <div className={classes.input}>
            <AccountCircleIcon className={classes.iconInput} />
            <CssTextField
              value={datos.emergencias}
              onChange={handleOnChangeInput('emergencias')}
              disabled={enableInputs.emergencias}
              className={classes.margin}
              style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
              id="custom-css-standard-input" label="EMERGENCIAS" />
            <FormControlLabel
              control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("emergencias")} />}
              label="Editar"
              className={classes.switch}
            />
            <FormHelperText
              style={{ color: "#992254", paddingLeft: "1.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>
              {datos.emergenciasOK ? '' : 'Numero telefonico invalido'}
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
        </div>
        
        <button className={"boton " + classes.boton} onClick={submitData}>ACEPTAR</button>
      </div>
    </div>
  )
}

export default CiudadConfig;
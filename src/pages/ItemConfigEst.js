import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { FormControl, FormControlLabel, InputLabel, Modal, NativeSelect, Switch, TextField } from '@material-ui/core';
import { makeStyles, Theme, withStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import CssTextField from '../components/CssTextField';
import CstSwitch from '../components/CstSwitch';
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

function ItemConfigEst() {
  const classes = styles();
  const [ciudades, setCiudades] = useState([{ ID: 0, CIUDAD: "NO CITY" }]);
  const [enableInputs, setEnableInputs] = useState({
    "lunes": true,
    "martes": true,
    "miercoles": true,
    "jueves": true,
    "viernes": true,
    "sabado": true,
    "domingo": true,
    "ciudad": true,
    "colonia": true,
    "numero": true,
    "cp": true,
    "calle": true
  });

  const [datos, setDatos] = useState({
    "id": null,
    "lunes_1": "",
    "lunes_2": "",
    "martes_1": "",
    "martes_2": "",
    "miercoles_1": "",
    "miercoles_2": "",
    "jueves_1": "",
    "jueves_2": "",
    "viernes_1": "",
    "viernes_2": "",
    "sabado_1": "",
    "sabado_2": "",
    "domingo_1": "",
    "domingo_2": "",
    "ciudad": 0,
    "colonia": "",
    "numero": "",
    "cp": "",
    "calle": ""
  });

  const handleEnableInputs = (item) => {
    const newEnables = JSON.parse(JSON.stringify(enableInputs));
    newEnables[item] = !newEnables[item];
    setEnableInputs(newEnables);
  }

  const handleChangeInput = (prop) => (evt) => {
    setDatos({ ...datos, [prop]: evt.target.value })
  }

  const handleSubmitData = () => {
    const callbackOk = res => {
      const data = res.data;
      if (data.error) {
        alert("Ha ocurriod un error");
        console.log(data.error);
        return;
      }
      alert("Proceso exitoso");
    }
    const callbackError = err => {
      console.log(err.message);
      alert("Ha ocurrido un error, recargue la pagina!");
    }
    if (!params.item) {
      const body = {
        username: cookies.get('username'),
        pass: cookies.get('password'),
        establecimiento: cookies.get('establecimientoId'),
        lunes: datos.lunes_1 + '-' + datos.lunes_2,
        martes: datos.martes_1 + '-' + datos.martes_2,
        miercoles: datos.miercoles_1 + '-' + datos.miercoles_2,
        jueves: datos.jueves_1 + '-' + datos.jueves_2,
        viernes: datos.viernes_1 + '-' + datos.viernes_2,
        sabado: datos.sabado_1 + '-' + datos.sabado_2,
        domingo: datos.domingo_1 + '-' + datos.domingo_2
      }
      
      datos.id == null ?
        axios.post(`http://localhost:5000/admin_establecimiento/horarioAtencion`, {
          data: { ...body }
        }).then(callbackOk).catch(callbackError)
        :
        axios.put(`http://localhost:5000/admin_establecimiento/horarioAtencion`, {
          data: { ...body }
        }).then(callbackOk).catch(callbackError);
    }else{
      const body = {
        username: cookies.get('username'),
        pass: cookies.get('password'),
        ciudad: datos.ciudad,
        colonia: datos.colonia,
        numero: datos.numero,
        cp: datos.cp,
        calle: datos.calle
      }
      if(params.id==0){
        axios.post(`http://localhost:5000/admin_establecimiento/direccion`,{
          data:{
            ...body,
            establecimiento: cookies.get('establecimientoId')
          }
        }).then(callbackOk).catch(callbackError)
      }else{
        axios.put(`http://localhost:5000/admin_establecimiento/direccion`,{
          data:{
            ...body,
            direccion: params.id
          }
        }).then(callbackOk).catch(callbackError)
      }
    }
  }
  const params = useParams();
  useEffect(() => {
    
    if(params.id==0){
      axios.get('http://localhost:5000/no_users/listarCiudades').then(
            res => {
              console.log("Obteniendo ciudades")
              const data = res.data;
              setCiudades([...data])
            }
          ).catch(err => {
            console.log(err.message)
          });
      return;
    }
    console.log("Cargando datos!")
    if (!params.item) {
      axios.get(`http://localhost:5000/no_users/horario_atencion/${cookies.get('establecimientoId')}`)
        .then(res => {
          let data = res.data;
          if (data.error) {
            alert("Ha ocurrido un error, recargue la pagina!")
            return;
          }
          
          data = data[0];
          if(!data)return;
          console.log(data)
          const claves = Object.keys(data);
          let newDatos = {
            id: data.ID
          }
          for (let i = 1; i < 8; i++) {
            const substr = data[claves[i]].split("-");
            switch (claves[i]) {
              case "LUNES":
                newDatos = { ...newDatos, lunes_1: substr[0], lunes_2: substr[1] }
                break;
              case "MARTES":
                newDatos = { ...newDatos, martes_1: substr[0], martes_2: substr[1] }
                break;
              case "MIERCOLES":
                newDatos = { ...newDatos, miercoles_1: substr[0], miercoles_2: substr[1] }
                break;
              case "JUEVES":
                newDatos = { ...newDatos, jueves_1: substr[0], jueves_2: substr[1] }
                break;
              case "VIERNES":
                newDatos = { ...newDatos, viernes_1: substr[0], viernes_2: substr[1] }
                break;
              case "SABADO":
                newDatos = { ...newDatos, sabado_1: substr[0], sabado_2: substr[1] }
                break;
              case "DOMINGO":
                newDatos = { ...newDatos, domingo_1: substr[0], domingo_2: substr[1] }
                break;
            }
          }
          setDatos({ ...datos, ...newDatos })

        }).catch(err => {
          console.log(err.message);
          alert("Ha ocurrido un error, recargue la pagina!")
          return;
        });
      return;
    } else {
      axios.get(`http://localhost:5000/no_users/direccion/${params.id}`)
        .then(res => {
          const data = res.data;
          if (data.error) {
            console.log(data.error);
            alert("Ha ocurrido un error. Recargue la pagina!");
            return;
          }
          setDatos({...datos,
            ciudad: data[0].ID_CIUDAD,
            colonia: data[0].COLONIA,
            calle: data[0].CALLE,
            cp: data[0].CP,
            numero: data[0].NUMERO,
          })
          axios.get('http://localhost:5000/no_users/listarCiudades').then(
            res => {
              const data = res.data;
              setCiudades([...data])
            }
          ).catch(err => {
            console.log(err.message)
          });

        }).catch(err => {
          console.log(err.message);
          alert("Ha ocurrido un error, recargue la página!")
        })
    }
  }, []);

  return (
    <div className='container'>
      <div className='wrapper'>
        <h1 className='title'>{(params.item) ? params.item.toUpperCase() + " -> ID: " + params.id : "Horarios de atencion"}</h1>
        <div className={classes.formData}>
          {params.item ? (
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
                    onChange={handleChangeInput('ciudad')}
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
                  required
                  value={datos.colonia}
                  onChange={handleChangeInput('colonia')}
                  disabled={enableInputs.colonia}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Colonia" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("colonia")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  required
                  value={datos.calle}
                  onChange={handleChangeInput('calle')}
                  disabled={enableInputs.calle}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Calle" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("calle")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  required
                  value={datos.numero}
                  onChange={handleChangeInput('numero')}
                  disabled={enableInputs.numero}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Numero" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("numero")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <CssTextField
                  required
                  value={datos.cp}
                  onChange={handleChangeInput('cp')}
                  disabled={enableInputs.cp}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "90%", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" label="Codigo postal" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("cp")} />}
                  label="Editar"
                  className={classes.switch}
                />
              </div>
            </>
          ) : (
            <>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>LUNES</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.lunes_1}
                  onChange={handleChangeInput('lunes_1')}
                  disabled={enableInputs.lunes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.lunes_2}
                  onChange={handleChangeInput('lunes_2')}
                  disabled={enableInputs.lunes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("lunes")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>MARTES</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.martes_1}
                  onChange={handleChangeInput('martes_1')}
                  disabled={enableInputs.martes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.martes_2}
                  onChange={handleChangeInput('martes_2')}
                  disabled={enableInputs.martes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("martes")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>MIERCOLES</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.miercoles_1}
                  onChange={handleChangeInput('miercoles_1')}
                  disabled={enableInputs.miercoles}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.miercoles_2}
                  onChange={handleChangeInput('miercoles_2')}
                  disabled={enableInputs.miercoles}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("miercoles")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>JUEVES</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.jueves_1}
                  onChange={handleChangeInput('jueves_1')}
                  disabled={enableInputs.jueves}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.jueves_2}
                  onChange={handleChangeInput('jueves_2')}
                  disabled={enableInputs.jueves}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("jueves")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>VIERNES</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.viernes_1}
                  onChange={handleChangeInput('viernes_1')}
                  disabled={enableInputs.viernes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.viernes_2}
                  onChange={handleChangeInput('viernes_2')}
                  disabled={enableInputs.viernes}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("viernes")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>SABADO</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.sabado_1}
                  onChange={handleChangeInput('sabado_1')}
                  disabled={enableInputs.sabado}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.sabado_2}
                  onChange={handleChangeInput('sabado_2')}
                  disabled={enableInputs.sabado}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("sabado")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
              <div className={classes.input}>
                <AccountCircleIcon className={classes.iconInput} />
                <InputLabel style={{ color: "white", paddingLeft: "1rem" }}>DOMINGO</InputLabel>
                <CssTextField
                  required
                  type='time'
                  value={datos.domingo_1}
                  onChange={handleChangeInput('domingo_1')}
                  disabled={enableInputs.domingo}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />

                <CssTextField
                  required
                  type='time'
                  value={datos.domingo_2}
                  onChange={handleChangeInput('domingo_2')}
                  disabled={enableInputs.domingo}
                  className={classes.margin}
                  style={{ margin: " auto 1.5rem ", width: "auto", paddingTop: "0.5rem" }}
                  id="custom-css-standard-input" />
                <FormControlLabel
                  control={<CstSwitch name="checkedB" onClick={() => handleEnableInputs("domingo")} />}
                  label="Editar"
                  className={classes.switch}
                />

              </div>
            </>
          )}

        </div>
        <button className={"boton " + classes.boton} onClick={handleSubmitData}>ACEPTAR</button>
      </div>
    </div>
  )
}

export default ItemConfigEst;
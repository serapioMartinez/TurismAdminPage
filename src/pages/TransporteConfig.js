import { FormControl, InputLabel, makeStyles, NativeSelect } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Salida from '../components/Salida';
import Cookies from 'universal-cookie';

const cookie = new Cookies();
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
function TransporteConfig() {
    const params = useParams();
    const classes = styles();
    const [ciudades, setCiudades] = useState([{ ID: 0, CIUDAD: "NO CITY" }]);
    const [salidas, setSalidas] = useState([]);
    const [ciudad, setCiudad] = useState(params.id?params.id:0);
    const consultarSalidas = () => {
      axios.get(`http://localhost:5000/no_users/salidasId/${cookie.get('establecimientoId')}/${params.id}`)
    .then(res => {
        let data = res.data;
        if(data.error){
            console.log(data.error);
            alert('Un error ha ocurrido, por favor intenta de nuevo mas tarde!');
            return;
        }
        console.log(data)
        const isEmpty = data.length==0;
        if(isEmpty){
          data.push({
            ID: '0',
            DIA: "LN",
            DURACION: 0,
          });
          data.push({
            ID: '-1',
            DIA: "MT",
            DURACION: 0,
          });
          data.push({
            ID: '-2',
            DIA: "MR",
            DURACION: 0,
          });
          data.push({
            ID: '-3',
            DIA: "JV",
            DURACION: 0,
          });
          data.push({
            ID: '-4',
            DIA: "VR",
            DURACION: 0,
          })
          data.push({
            ID: '-5',
            DIA: "SB",
            DURACION: 0,
          })
          data.push({
            ID: '-6',
            DIA: "DM",
            DURACION: 0,
          })

        }
        else{
          var aux_arr = [];
          data.forEach(element => {
            aux_arr.push(element.DIA)
          });
          const arr_cmp = ["LN","MT","MR","JV","VR","SB","DM"];
          aux_arr = arr_cmp.filter(x => aux_arr.indexOf(x) == -1)
          aux_arr.forEach(element => {
            data.push({
              ID: '0',
              DIA: element,
              DURACION: 0,
            })
          });
        }
        console.log(data);
        setSalidas([...data]);
    }).catch(err => {
        console.log(err.message);
        alert('Un error ha ocurrido, por favor intenta de nuevo mas tarde!');
        
    })
    }
    const handleConsultSalidas = () => {
      if(ciudad==0) return;
      if(!window.confirm("Consultar nuevas salidas eliminara los datos no guardados introducidos en la pagina"))return;
      consultarSalidas()
    }
    const handleChangeSalidasValues = (index) => evt => {
      var newSalidas = [...salidas];
      var salida_conf = newSalidas[index];
      salida_conf = {
        ...salida_conf,
        DURACION: evt.target.value
      }
      newSalidas.splice(index,1,salida_conf);
      setSalidas([...newSalidas])
    } 
    useEffect(() => {
        
        axios.get('http://localhost:5000/no_users/listarCiudades').then(
            res => {
              const data = res.data;
              if(data.error){
                console.log(data.error);
                alert('Un error ha ocurrido, por favor intenta de nuevo mas tarde!');
                return;
            }

            console.log(data);
              setCiudades([...data])
            }
          ).catch(err => {
            console.log(err.message)
          });
          if(ciudad!=0)consultarSalidas();
          
    },[]);
  return (
    <div className='container'>
      <div className='wrapper'>
        <h1 className='title'>SALIDAS</h1>
        <div className={classes.formData}>
        <div className={classes.input}>
                
                <FormControl className={classes.formControl}>
                  <InputLabel style={{ color: "white" }}>CIUDAD: </InputLabel>
                  <NativeSelect
                    id='ciudad'
                    value={ciudad}
                    onChange={evt => setCiudad(evt.target.value)}
                    style={{ color: "white", backgroundColor: "#ffffff45", borderRadius: "5px", paddingLeft: "0.5rem", width: "90%", paddingTop: "0.5rem" }}>
                    <option style={{ backgroundColor: "black" }} value='0'>Elegir</option>
                    {ciudades.map(ciudad => {
                      return <option key={ciudad.ID} style={{ backgroundColor: "black" }} value={ciudad.ID}>{ciudad.CIUDAD}</option>
                    })}

                  </NativeSelect>

                </FormControl>
                <button className={"boton "+classes.boton} onClick={handleConsultSalidas}>CONSULTAR</button>
              </div>
        
        </div>
        <div className={classes.formData}>
            {
                salidas.map((salida,i) => <Salida id={salida.ID} dia={salida.DIA} duracion={salida.DURACION} action={handleChangeSalidasValues} index={i} ciudad={ciudad}/>)
            }
        </div>
      </div>
    </div>
  )
}

export default TransporteConfig
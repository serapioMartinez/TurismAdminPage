import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

import AdminDatos from "../components/AdminDatos";
import CiudadDatos from "../components/CiudadDatos";
import ItemInfo from "../components/ItemInfo";

const styles = makeStyles({
  container: {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "2rem",
    marginRight: "1rem"
  },
  fistLevel: {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center"
  }

});

export default function HomePageCiudad() {
  const classes = styles();
  const [statusAxios , setStatusAxios]= useState({
    ciudad: false,
    establecimientos: false,
    platillos: false,
    zonas: false,
    personajes: false,
    festividades: false,
    notas: false
  });
  const handleStatus = prop => {
    setStatusAxios({...statusAxios,[prop]:true});
  }
  return (
    <div className={classes.container}>
      <div className={classes.fistLevel}>
        <div>
          <AdminDatos action={handleStatus}/>
          <CiudadDatos status={statusAxios.ciudad} action={handleStatus}/>
        </div>
        <ItemInfo type="establecimientos" next="platillos" status={statusAxios.establecimientos} action={handleStatus}/>
      </div>
      <ItemInfo type="platillos" next="zonas" status={statusAxios.platillos} action={handleStatus}/>
      <ItemInfo type="zonas" next="personajes" status={statusAxios.zonas} action={handleStatus}/>
      <ItemInfo type="personajes" next="festividades" status={statusAxios.personajes} action={handleStatus}/>
      <ItemInfo type="festividades" next="notas" status={statusAxios.festividades} action={handleStatus}/>
      <ItemInfo type="notas" status={statusAxios.notas} action={handleStatus}/>
    </div>
  );
}
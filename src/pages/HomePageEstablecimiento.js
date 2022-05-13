import React, {  useState } from "react";
import { makeStyles } from "@material-ui/core";

import AdminDatos from "../components/AdminDatos";
import ItemInfo from "../components/ItemInfo";
import EstablecimientoDatos from "../components/EstablecimientoDatos";

import Cookies from 'universal-cookie';

const cookies = new Cookies();
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

export default function HomePageEstablecimiento() {
  const classes = styles();
  const [statusAxios , setStatusAxios]= useState({
    establecimiento: false,
    atencion: false,
    direccion: false
  });
  const handleStatus = prop => {
    setStatusAxios({...statusAxios,[prop]:true});
  }

  return (
    <div className={classes.container}>
      <div className={classes.fistLevel}>
        <div>
          <AdminDatos action={handleStatus}/>
          <EstablecimientoDatos status={statusAxios.establecimiento} action={handleStatus}/>
        </div>
        <div>
          <ItemInfo next="direccion" status={statusAxios.atencion} action={handleStatus} type="atencion" />
          <ItemInfo status={statusAxios.direccion} action={handleStatus} type="direcciones" />
        </div>
      </div>
    </div>
  );
}
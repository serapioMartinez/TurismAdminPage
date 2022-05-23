import { createTheme, ThemeProvider } from "@material-ui/core";
import Header from "./components/Header";
import SideBarCiudad from "./components/SideBarCiudad";

import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";

import './App.css';
import HomePageCiudad from "./pages/HomePageCiudad";
import Items from "./pages/Items";
import UserConfig from "./pages/UserConfig";
import CiudadConfig from "./pages/CiudadConfig";
import ItemConfig from "./pages/ItemConfig";
import Login from "./pages/Login";
import { Fragment } from "react";
import Registration from "./pages/Registration";
import SideBarEstablecimiento from "./components/SideBarEstablecimiento";
import HomePageEstablecimiento from "./pages/HomePageEstablecimiento";
import EstablecimientoConfig from "./pages/EstablecimientoConfig";
import ItemConfigEst from "./pages/ItemConfigEst";
import EstablecimientoClaim from "./pages/EstablecimientoClaim";
import TransporteConfig from "./pages/TransporteConfig";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registration/>}/>
        <Route path="ciudad" element={
          <Fragment>
            <Header />
            <SideBarCiudad />
            <Outlet/>
            </Fragment>
        } >
          <Route path="inicio" element={<HomePageCiudad />} />
          <Route path="usuario" element={<UserConfig />} />
          <Route path="ciudad" element={<CiudadConfig />} />
          <Route path=":item" element={<Items />} />
          <Route path=":item/:id" element={<ItemConfig />} />
        </Route>
        <Route path="establecimiento" element={
          <Fragment>
            <Header />
            <SideBarEstablecimiento/>
            <Outlet/>
            </Fragment>
        } >
          <Route path="inicio" element={<HomePageEstablecimiento />} />
          <Route path="usuario" element={<UserConfig />} />
          <Route path="establecimiento" element={<EstablecimientoConfig/>} />
          <Route path="reclamar" element={<EstablecimientoClaim/>} />
          <Route path=":item" element={<Items />} />
          <Route path=":item/:id" element={<ItemConfigEst />} />
          <Route path="transporte/:id" element={<TransporteConfig />} />
          <Route path="atencion" element={<ItemConfigEst />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}
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
          <Route path="direccion" element={<Items />} />
          <Route path="atencion" element={<Items />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}
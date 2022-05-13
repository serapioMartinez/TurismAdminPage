import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent
} from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

//Iconos
import HomeIcon from '@material-ui/icons/Home';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LandscapeIcon from '@material-ui/icons/Landscape';
import NoteIcon from '@material-ui/icons/Note';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

import 'react-pro-sidebar/dist/css/styles.css';
import Header from "./Header.css";

function SideBarEstablecimiento() {
    let navigate = useNavigate();

    const clave = window.location.href.split('/').at(-1);
    const [menuCollapse, setMenuCollapse] = useState(false);
    const [activeMenuItems, setActiveMenuItems] = useState({
        "inicio": (clave=="inicio")?true:false,
        "platillos": (clave=="platillos")?true:false,
        "personajes": (clave=="personajes")?true:false,
        "festividades": (clave=="festividades")?true:false,
        "notas": (clave=="notas")?true:false,
        "zonas": (clave=="zonas")?true:false,
        "reseñas": (clave=="reseñas")?true:false,
    });
    const menuIconClick = () => {
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    }
    const setActivate = item => {
        console.log(item);
        if (activeMenuItems[item]) return;
        switch(item){
            case "inicio": 
            case "platillos": 
            case "personajes": 
            case "festividades": 
            case "notas": 
            case "zonas": 
            navigate(item);break;
            default: navigate("inicio");break;
        }
    }
    return (
        <Fragment>
            <div id="header">
                <ProSidebar collapsed={menuCollapse}>
                    <SidebarHeader>
                        <Menu iconShape="square">
                            <MenuItem icon={<FormatListBulletedIcon />} onClick={menuIconClick}></MenuItem>
                        </Menu>
                    </SidebarHeader>
                    <SidebarContent>
                        <Menu >
                            <MenuItem active={activeMenuItems.inicio} onClick={() => navigate('inicio')} icon={<HomeIcon />}>
                                INICIO
                            </MenuItem>
                            <MenuItem active={activeMenuItems.platillos} onClick={() => setActivate("platillos")} icon={<LocalDiningIcon />} >
                                HORARIO ATENCION
                            </MenuItem>
                            <MenuItem active={activeMenuItems.personajes} onClick={() => setActivate("personajes")} icon={<NaturePeopleIcon />}>
                                DIRECCIONES
                            </MenuItem>
                        </Menu>
                    </SidebarContent>
                </ProSidebar>
            </div>
        </Fragment>
    )
}

export default SideBarEstablecimiento;
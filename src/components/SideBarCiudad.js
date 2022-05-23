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

function SideBarCiudad() {
    let navigate = useNavigate();

    const clave = window.location.href.split('/').at(-1);
    console.log(clave)
    const [menuCollapse, setMenuCollapse] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("inicio");
    const menuIconClick = () => {
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    }
    const setActivate = item => {
        console.log(item);
        if (activeMenuItem==item) return;
        setActiveMenuItem(item);
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
                            <MenuItem active={activeMenuItem=="inicio"} onClick={() => navigate('inicio')} icon={<HomeIcon />}>
                                INICIO
                            </MenuItem>
                            <MenuItem active={activeMenuItem=="platillos"} onClick={() => setActivate("platillos")} icon={<LocalDiningIcon />} >
                                PLATILLOS
                            </MenuItem>
                            <MenuItem active={activeMenuItem=="personajes"} onClick={() => setActivate("personajes")} icon={<NaturePeopleIcon />}>
                                PERSONAJES
                            </MenuItem>
                            <MenuItem active={activeMenuItem=="festividades"} onClick={() => setActivate("festividades")} icon={<DateRangeIcon />}>
                                FESTIVIDADES
                            </MenuItem>
                            <MenuItem active={activeMenuItem=="notas"} onClick={() => setActivate("notas")} icon={<LandscapeIcon />}>
                                NOTAS
                            </MenuItem>
                            <MenuItem active={activeMenuItem=="zonas"} onClick={() => setActivate("zonas")} icon={<NoteIcon />}>
                                ZONAS
                            </MenuItem>
                            <MenuItem icon={<ThumbsUpDownIcon />}>
                                RESEÑAS
                            </MenuItem>
                        </Menu>
                    </SidebarContent>
                </ProSidebar>
            </div>
        </Fragment>
    )
}

export default SideBarCiudad;
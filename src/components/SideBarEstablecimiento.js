import { Fragment, useEffect, useState } from "react";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarContent
} from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

//Iconos
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';

import 'react-pro-sidebar/dist/css/styles.css';
import Header from "./Header.css";
import Cookies from "universal-cookie";
import { Schedule } from "@material-ui/icons";
const cookie = new Cookies();

function SideBarEstablecimiento() {
    let navigate = useNavigate();

    const clave = window.location.href.split('/').at(-1);
    const [menuCollapse, setMenuCollapse] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState({
        "activo": clave
    });
    const menuIconClick = () => {
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    }
    const setActivate = item => {
        console.log(item);
        if (activeMenuItem.activo==item) return;
        
        setActiveMenuItem({activo: item})
        switch(item){
            case "inicio": 
            case "atencion":
            case "direcciones":
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
                            <MenuItem active={activeMenuItem.activo=="inicio"} onClick={() => setActivate('inicio')} icon={<HomeIcon />}>
                                INICIO
                            </MenuItem>
                            <MenuItem active={activeMenuItem.activo=="atencion"} onClick={() => cookie.get('establecimientoId')=='null'?false:setActivate("atencion")} icon={<Schedule />} >
                                HORARIO ATENCION
                            </MenuItem>
                            <MenuItem active={activeMenuItem.activo=="direcciones"} onClick={() => cookie.get('establecimientoId')=='null'?false:setActivate("direcciones")} icon={<ExploreIcon />}>
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
import React from "react";
import {generateColorMode} from "./style/enable-dark-mode";
import {useThemeContext} from "../context/theme-context";


export const HomeComponent = () => {
    const {theme} = useThemeContext();
    return (
        <div className={generateColorMode(theme)}
             style={{width: "100%", height: "calc(100% - 64px)", textAlign: "center"}}>
            {/*<img src={"/assets/img/messengerlite.png"} alt={"messenger lite"} width={"200px"}/>*/}
        </div>
    )
}
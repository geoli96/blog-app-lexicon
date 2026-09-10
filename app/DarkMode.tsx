"use client";
import { useEffect } from "react";

export default function DarkMode(){
    useEffect(() => {
        const darkmode = localStorage.getItem("darkmode");
        if(darkmode){
            document.getElementsByTagName("html")[0].classList.add("dark-mode-html");
        }
    },[])
    return null;
}
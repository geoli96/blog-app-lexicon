"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import styles from "./BackLink.module.css";
import { usePathname, useSearchParams } from "next/navigation";

export default function BackLink({ path = "/", children = "← Back", navigatedTo = true, hideBackLink }: { path?: string; children?: ReactNode; navigatedTo?:boolean; hideBackLink?:boolean }) {
  const [loaded, setLoaded] = useState(false);
  const initialBackIndex = useRef(0);
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const _path = pathname+"?"+searchParams.toString();
  const navigations = useRef({pathname: _path, navigations: 0});

  useEffect(() => {
    setLoaded(true);
    initialBackIndex.current = window.history.length;
  },[])

  useEffect(() => {
    if(navigations.current.pathname !== _path){
      navigations.current.pathname = _path;
      navigations.current.navigations = navigations.current.navigations+1;
    }
  })

  if(!loaded) return <div className={styles.emptyLink} ></div>;

  // navigatedTo true by default for now but router.back() will not work on non client navigation 
  // navigatedTo param needs to be added to links and router.push() where it is used
  // currently router.back() will be run when you open a new tab and open a link for instance which it shouldn't
  // since we don't know if it is a client navigation or a new tab or link click externally
  if(!navigatedTo || hideBackLink) return <div className={styles.emptyLink} ></div>;

  function goBack() {
    console.log(-navigations.current.navigations)
      history.go(-1-navigations.current.navigations);
  }

  return <button className={styles.link} onClick={goBack}>{children}</button>;
}

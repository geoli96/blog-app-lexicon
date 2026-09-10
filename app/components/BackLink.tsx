"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./BackLink.module.css";

export default function BackLink({ path = "/", children = "← Back", navigatedTo = true, hideBackLink }: { path?: string; children?: ReactNode; navigatedTo?:boolean; hideBackLink?:boolean }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  },[])

  if(!loaded) return <div className={styles.emptyLink} ></div>;

  // navigatedTo true by default for now but router.back() will not work on non client navigation 
  // navigatedTo param needs to be added to links and router.push() where it is used
  // currently router.back() will be run when you open a new tab and open a link for instance which it shouldn't
  // since we don't know if it is a client navigation or a new tab or link click externally
  if(!navigatedTo || hideBackLink) return <div className={styles.emptyLink} ></div>;

  function goBack() {
      history.back();
  }

  return <a className={styles.link} onClick={goBack}>{children}</a>;
}

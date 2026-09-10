"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshData() {
    const router = useRouter();
    useEffect(() => {
        history.scrollRestoration = "manual"; // to make scroll go to top when using router.back()
        window.addEventListener("popstate", () => {
            router.refresh();
        })
    },[])
    return null;
}
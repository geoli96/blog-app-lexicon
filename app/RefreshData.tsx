"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshData() {
    const router = useRouter();
    useEffect(() => {
        window.addEventListener("popstate", () => {
            router.refresh();
        })
    },[])
    return null;
}
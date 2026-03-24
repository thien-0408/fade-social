"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AosInit = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            easing: "ease-out-cubic",
        });
    }, []);

    return null;
};

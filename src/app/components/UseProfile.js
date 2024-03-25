// @/app/components/UseProfile.js

'use client'; // Mark the component as a client-side component

import { useEffect, useState } from "react";

export function useProfile() {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true)
        fetch('/api/profile').then(response => {
            response.json().then(data => {
                setData(data);
                setLoading(false);
            });
        })
    },[]);


    return {loading, data};
}

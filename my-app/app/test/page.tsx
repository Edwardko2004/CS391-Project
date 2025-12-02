"use client";

import * as Type from "../lib/types";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseAuth } from "../lib/SupabaseProvider";
import UserReservedEvents from "../components/UserReservedEvents";

export default function TestProfile() {
    console.log("call component")

    const {user} = useSupabaseAuth();
    const [profile, setProfile] = useState<Type.Profile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            setLoading(true);

            if (user) {
                const {data, error} = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (error) {
                    console.error('Error fetching profile:', error);
                    setProfile(null);
                } else {
                    console.log("profile set!")
                    setProfile(data);
                }
            } else {
                console.log("no user found!")
                setProfile(null);
            }

            setLoading(false);
        }

        fetchProfile();
        console.log("querying done!")
        console.log(profile)
    }, [user])

    if (loading) {
        console.log("loading...")
        return (
            <p>LOADING...</p>
        );
    }

    if (profile != null) {
        console.log("returning profile list!")
        return (
            <UserReservedEvents profile={profile} />
        );
    }
}
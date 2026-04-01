import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import MainPage from "./MainPage";
import {performGetEmailByUsername} from "../../shared/lib/services/performGetEmailByUsername";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MainPageWrapper = () => {
    let email: any, setEmail: any;
    [email, setEmail] = useState<string | undefined>(undefined);
    const query = useQuery()
    const token = query.get("token") || undefined;

    const {username} = useParams<{ username: string }>();

    useEffect(() => {
        if (!username) return;

        performGetEmailByUsername(username)
            .then(data => setEmail(data.email))
            .catch(() => setEmail(undefined));

    }, [setEmail, username]);

    return <MainPage
        resetToken={token}
        viewedUserEmail={email}/>
};

export default MainPageWrapper;
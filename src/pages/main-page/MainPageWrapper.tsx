import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import MainPage from "./MainPage";
import {performGetEmailByUsername} from "../../shared/lib/services/performGetEmailByUsername";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MainPageWrapper = () => {
    let email: any, setEmail: any;
    [email, setEmail] = useState<string | undefined>(undefined);
    const query = useQuery()
    const navigate = useNavigate();
    const token = query.get("token") || undefined;

    const {
        username,
        fileId
    } = useParams<{
        username: string
        fileId: string
    }>();

    useEffect(() => {
        if (!username) {
            navigate("/");
            return;
        }

        performGetEmailByUsername(username)
            .then(data => setEmail(data.email))
            .catch(() => setEmail(undefined));

    }, [email, navigate, setEmail, username]);

    return <MainPage
        resetToken={token}
        viewedUserEmail={email}
        fileId={fileId}
    />
};

export default MainPageWrapper;
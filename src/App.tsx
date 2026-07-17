import React from 'react';
import './App.scss';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPageWrapper from "./pages/main-page/MainPageWrapper";
import VerifyPage from "./pages/verify-page/VerifyPage";
import useRefreshToken from "./shared/lib/hooks/useRefreshToken";

function App() {

    useRefreshToken();

    return (

        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <MainPageWrapper/>
                    }
                />
                <Route
                    path="/verify"
                    element={
                        <VerifyPage/>
                    }
                />
                <Route
                    path="/resetPassword"
                    element={
                        <MainPageWrapper/>
                    }
                />
                <Route
                    path="/:username"
                    element={
                        <MainPageWrapper/>
                    }
                />
                <Route
                    path="/:username/file/:fileId"
                    element={
                        <MainPageWrapper/>
                    }
                />
            </Routes>

        </Router>
    );
}

export default App;

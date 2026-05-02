import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { PrivateRoute } from "./PrivateRoute";
import { Dashboard } from "../pages/Dashboard";
import { Cards } from "@/pages/Cards";
import { Entries } from "@/pages/Entries";


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route element={<PrivateRoute/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Route>
            <Route element={<PrivateRoute/>}>
                <Route path="/entries" element={<Entries/>}/>
            </Route>
            <Route element={<PrivateRoute/>}>
                <Route path="/cards" element={<Cards/>}/>
            </Route>
        </Routes>
    );
}
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {

    const navigate = useNavigate();
    return (
        <div>
            <div>NAV BAR</div>
            <button className="border border-black mr-10" onClick={() => navigate("/profile")}>go to prtofile</button>
            <button onClick={() => navigate("/dashboard")}>go to dashboard</button>
            <div> <Outlet/></div>
        </div>
    );
}
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const check = JSON.parse(localStorage.getItem("isLogin"));
    return (check? <Outlet/>:<Navigate to='/' replace={true}/>);
}
 
export default PrivateRoute;
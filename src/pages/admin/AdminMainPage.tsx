import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminMainPage() {
    const role = useContext(AuthContext).role;
    const navigate = useNavigate();
    console.log(role);
    if(role === null) {
        console.log("No role, probably waiting for auth...");
        return <div>Loading...</div>;
    }
    else if(role !== '2') {
        alert("No exception!");
        navigate('/');
    }
    return(
    <div>
        <div className="text-7xl">
            Not implemented;
        </div>
    </div>
    );
}
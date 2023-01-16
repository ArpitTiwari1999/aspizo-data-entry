import React, {useState} from "react";
import "./Login.css";
import Papa from "papaparse";

const Login = ({ setLoggedIn }) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const checkLogin = () => {
        // Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vRaPKEgM2I57uW0dvHRizYJPjcHR881fs9mnRga2EELeZIUx35szhAyoELOa-Slho3zxXsLijFxDrHn/pub?output=csv", {
        //     download: true,
        //     header: true,
        //     complete: (results) => {
        //         if(results && results.data && results.data.length) {
        //           let filterData = {
        //             Bihar: [],
        //             Jharkhand: [],
        //             Odisha: []
        //           };
        //           for(let data of results.data) {
        //             filterData[data['State']] = [...filterData[data['State']], data]
        //           }
        //           setData(filterData);
        //         }
        //     },
        // });
        // if(user === "admin" && password === "Admin@12345") setLoggedIn(true);
        // else alert("Invalid Username/Password");
    }
    return (
        <div>
            <div id="bg"></div>
            <form>
                <div className="form-field">
                    <input type="text" placeholder="Email / Username" required value={user} onChange={(event) => setUser(event.target.value)} />
                </div>
                <div className="form-field">
                    <input type="password" placeholder="Password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div className="form-field">
                    <button className="btn" type="submit" onClick={checkLogin}>Log in</button>
                </div>
            </form>
        </div>
    );
}

export default Login;

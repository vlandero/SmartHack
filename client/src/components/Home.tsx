import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import image from './dashComponents/unknown.png'

function Home() {
    // eslint-disable-next-line
    const [loggedIn, setLoggedIn] = useState(false)

    // useEffect(() => {
    //     // fetch
    //     const requestToken = async () => {
    //         if(!sessionStorage.getItem("token"))
    //             setLoggedIn(false);
    //         const result = await fetch('/user/me', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 "Authorization": sessionStorage.getItem("token")
    //             },
    //         }).then((res)=>res.json())

    //         if(result.status === "error") {
    //             setLoggedIn(false);
    //         } else {
    //             setLoggedIn(true);
    //         }
    //     }
    //     requestToken()
    // }, [])

    return (
        <div className="home">
            <div className="home-left">
                <h1>Save your <br /> passwords here.</h1>
                <p>Lorem ipsum is a password storage area that has been
                    tested for security, so you can store your data here
                    safely without being afraid of it being stolen by others.</p>
                <Link to="/signup">
                    <button className="home-signup-btn">Sign up</button>
                </Link>
            </div>

            <div className="home-right">
                <div className="demo-container"></div>
            </div>
        </div>
    )
}

export default Home
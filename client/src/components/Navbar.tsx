import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom"

function Navbar({page}) {
    const [action, setAction] = useState("")
    
    // eslint-disable-next-line
    useEffect(() => {
        if (page === "Sign up") 
            setAction("Sign in")
        else if(page === "Home")
            setAction("@andreihodo")
      });

    return (
        <div className="navbar">
            <Link to="/" className="a-tag">
                <h1 className="title">Lorem ipsum</h1>
            </Link>

            <div className="mini-navbar">
                <div className="links">
                    <Link to="/" className="a-tag">
                        <p className="link">Home</p>
                    </Link>
                    <a href="https://twitter.com/andreihodo" target="_blank"><p className="link">Help</p></a>
                    <Link to="/signup" className="a-tag">
                        <p className="link">{page}</p>
                    </Link>
                </div>

            </div>

            <div className="navbar-action">
                <Link to="/signin">
                    <button className="navbar-btn">{action}</button>
                </Link>
            </div>
        </div>
    )
}

export default Navbar
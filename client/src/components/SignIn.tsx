import React, {useState} from "react"

function SignIn({setToken,setPass}) {
    const [signinDetails, setSigninDetails] = useState({})

    const handleChange = (e) => {
        const target = e.target;
        const value = target.type === 'password' ? target.value : target.value;
        const name = target.name;
        setSigninDetails({
            ...signinDetails,
            [name]: value
        })
    }
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signinDetails)
        }).then((res)=>res.json())

        if(result.status === "ok") {
            console.log(result);
            sessionStorage.setItem("token",result.data)
            sessionStorage.setItem("crpt",signinDetails['password'])
            window.location.href = "/dashboard"; 
        } else {
            alert(result.error)
        }

        // Clear input fields
        setSigninDetails({})
    }

    return (
        <div className="signin-container">
            <h1>Sign in</h1>
            <p>Sign in and start generating passwords</p>
            <form className="signin-form" onSubmit={handleSubmit}>
                <input type="text"
                    name="username"
                    placeholder="Username"
                    className="input-username"
                    onChange={handleChange}
                    />
                <input type="password"
                    name="password"
                    placeholder="Password"
                    className="input-password"
                    onChange={handleChange}
                />

                <button type="submit" 
                    onSubmit={handleSubmit}
                    className="signin-btn">
                        Sign in
                </button>
            </form>
        </div>
    )
}

export default SignIn
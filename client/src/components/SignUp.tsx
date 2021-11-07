import React, {useState} from "react"

function SignUp() {
    const [signUpDetails, setSignUpDetails] = useState({})

    const handleChange = (e) => {
        const target = e.target;
        const value = target.type === 'password' ? target.value : target.value;
        const name = target.name;
        setSignUpDetails({
            ...signUpDetails,
            [name]: value
        })
    }
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpDetails)
        }).then((res)=>res.json())

        if(result.status === "ok") {
            window.location.href = '/signin'
        } else {
            if(result.error.code === 11000) {
                alert("Username is already in use!");
            } else {
                alert("Eroare!");
                console.log(result.error);
            }
        }
        // Clear input fields
        setSignUpDetails({})
    }

    return (
        <div className="signup-container">
            <h1>Sign up</h1>
            <p>Create new account</p>
            <form className="signup-form" onSubmit={handleSubmit}>
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
                    className="signup-btn">
                        Sign up
                </button>
            </form>
        </div>
    )
}

export default SignUp
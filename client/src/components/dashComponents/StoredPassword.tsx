import React, {useState} from "react"

function StoredPassword({website, password,id,passwordEntries,setPasswordEntries,index,type,changed,setChanged}) {
    const [passwordShown, setPasswordShown] = useState(false);

    return (
        <div className="stored-password">
            <p>{website}</p>
            <input 
                type={passwordShown ? "text" : "password"}
                className="stored-password-input"
                value={password} 
                readOnly
            />
            <button className="showhide-btn"
                onClick={() => setPasswordShown(!passwordShown)}>
                    {passwordShown ? "Hide" : "Show"}
            </button>
            <button className="delete-btn" onClick={async()=>{
                let copy = [...passwordEntries]
                copy.slice(index,1)
                setPasswordEntries(copy)
                const result = await fetch(`/entries/${type}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':sessionStorage.getItem("token"),
                    }
                }).then((res)=>res.json())
                if(result.status === 'error')
                    return alert(result.error)
                setChanged(!changed)
            }}>Delete</button>
        </div>
    )
}

export default StoredPassword
import React, {useState,useEffect} from "react"
import Popup from "./dashComponents/Popup"
import KeysPopup from "./dashComponents/KeysPopup"
import StoredPassword from "./dashComponents/StoredPassword"
import { BsPlusCircleFill } from 'react-icons/bs';
import {decrypt,encrypt,genRSA,generatePassword} from './../crypto'


const defaultValue={
    length:8,
    symbol:false,
    uppercase:false,
    numbers:false
}
function Dashboard({pass,token}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isKeysOpen, setIsKeysOpen] = useState(false);
    const [passwordGeneratorConfig,setPasswordGeneratorConfig] = useState(defaultValue)
    const [newPassword, setNewPassword] = useState({})
    const [newKey, setNewKey] = useState({})
    const [passwordEntries,setPasswordEntries] = useState([])
    const [keyEntries, setKeyEntries] = useState([])
    const [changed,setChanged] = useState(false)
    const [cryptoSalt, setCryptoSalt] = useState('')
    useEffect(()=>{
        const getEntries = async ()=>{
            if(!sessionStorage.getItem('token'))
                return window.location.href = '/'
            const result = await fetch('/user/me', {
                method: 'POST',
                headers: {
                    "Authorization": sessionStorage.getItem('token')
                },
            }).then((res)=>res.json())
            if(result.status === "error") {
                window.location.href = '/'
            } else {
                setCryptoSalt(result.data.cryptoSalt)
                setPasswordEntries(result.data.passwordEntries.map((item)=>{
                    item.password=decrypt(item.password,sessionStorage.getItem("crpt"),result.data.cryptoSalt)
                    return item
                }))
                setKeyEntries(result.data.keyEntries.map((item)=>{
                    item.password=decrypt(item.password,sessionStorage.getItem("crpt"),result.data.cryptoSalt)
                    return item
                }))
                
            }
        }
        getEntries()
    },[changed])
    
    const togglePopup = () => {
        setIsOpen(!isOpen);
        setNewPassword(defaultValue)
    }

    const toggleKeysPopup = () => {
        setIsKeysOpen(!isKeysOpen);
        setNewKey({})
    }

    const handleSubmit = async (e:React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const result = await fetch('/entries/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':sessionStorage.getItem("token"),
            },
            body:JSON.stringify({
                type:'password',
                username:newPassword['username'],
                password:encrypt(newPassword['password'],sessionStorage.getItem("crpt"),cryptoSalt)
            })
        }).then((res)=>res.json())
        if(result.status === "error") {
            alert(result.error)
        } else {
            console.log(result.data);
            setPasswordEntries([...passwordEntries,{...newPassword,_id:result.data}])
        }
        togglePopup()
    }
    const keyHandleSubmit = async(e:React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const result = await fetch('/entries/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':sessionStorage.getItem("token"),
            },
            body:JSON.stringify({
                type:'key',
                username:newKey['username'],
                password:newKey['password']
            })
        }).then((res)=>res.json())
        if(result.status === "error") {
            alert(result.error)
        } else {
            console.log(result.data);
            setKeyEntries([...keyEntries,{...newKey,_id:result.data}])
        }
        toggleKeysPopup()
    }
    const handleChange = (e) => {
        const target = e.target;
        const {type, name} = target
        if (type === "text" || type === "number" || type === "password")
            setNewPassword({...newPassword, [name]: target.value})
        else
            setNewPassword({...newPassword, [name]: [target.checked]})
        
    }
    const handleChecks = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setPasswordGeneratorConfig({...passwordGeneratorConfig,[e.target.name]:e.target.value})
    }

    const keyHandleChange = (e) => {
        const target = e.target;
        const {type, name} = target
        if (type === "text" || type === "password")
            setNewKey({...newKey, [name]: target.value})
        else
            setNewKey({...newKey, [name]: target.value})
    }

    const passwordGenerator = (e:React.FormEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        console.log(newPassword);
        const x = generatePassword({
            length:passwordGeneratorConfig.length,
            includeSymbols:passwordGeneratorConfig.symbol,
            includeDigits:passwordGeneratorConfig.numbers,
            includeUppercase:passwordGeneratorConfig.uppercase
        })
        console.log(x);
        setNewPassword({...newPassword,password:x})
    }
    // Content for the popup
    const passwordsContent = 
    <>
        <h1 className="popup-title">Add a new password</h1>
        <form className="popup-form">
            <label className="text-inputs">
                Username:
                <input type="text"
                       name="username"
                       value={newPassword["username"]}
                       onChange={handleChange}
                       required
                />
            </label>
            <label className="text-inputs">
                Password:
                <input type="password"
                       name="password"
                       value={newPassword["password"]}
                       onChange={handleChange}
                       required
                />
            </label>
            <button
            type='button'
            onClick={passwordGenerator}
            className="generate-password">
                Generate Password
            </button>
            <label className="text-inputs">
                Length:
                <input type="number"
                       name="length"
                       value={passwordGeneratorConfig.length}
                       onChange={handleChecks}
                />
            </label>
            <label className="checkbox">
                Include Symbols:
                <input
                    name="symbol"
                    type="checkbox"
                    checked={passwordGeneratorConfig.symbol}
                    onChange={handleChecks} 
                />
            </label>
            <label className="checkbox">
                Include Numbers:
                <input
                    name="numbers"
                    type="checkbox"
                    checked={passwordGeneratorConfig.numbers}
                    onChange={handleChecks} 
                />
            </label>
            <label className="checkbox">
                Include Uppercase Letters:
                <input
                    name="uppercase"
                    type="checkbox"
                    checked={passwordGeneratorConfig.uppercase}
                    onChange={handleChecks} 
                />
            </label>

            <button className="popup-btn"
                    type="button"
                    onClick={handleSubmit}
            >
                Add password
            </button>
        </form>
    </>

    const keysContent = <>
        <form className="popup-form">

            <button className="generate-key" onClick={()=>{
                let rsaKEY = genRSA()
                setNewKey({...newKey,password:`Public:${rsaKEY.public}\nPrivate ${rsaKEY.private}`})
            }}>
                Generate Key
            </button>

            <select name="select"
                    value={newKey["select"]} 
                    onChange={keyHandleChange}
            >
                <option value="AES">AES</option>
                <option value="Triple-DES">Triple DES</option>
                <option value="RSA">RSA</option>
                <option value="ECC">ECC</option>
            </select>
            <label className="text-inputs">
                Key name:
                <input type="text"
                       name="username"
                       value={newKey["username"]}
                       onChange={keyHandleChange}
                       required
                />
            </label>
            <label className="key-input">
                Key:
                <textarea 
                       name="password"
                       value={newKey["password"]}
                       onChange={keyHandleChange}
                       required
                />
            </label>

            <button className="popup-btn popup-keys-btn"
                    type="button"
                    onClick={(e)=>{keyHandleSubmit(e)}}
            >
                Add key
            </button>
        </form>
    </>

    return (
        <div className="dashboard">
            <div className="dashboard-buttons">
                <button className="new-password-btn"
                        onClick={togglePopup}>
                    <BsPlusCircleFill className="plus-icon"/>
                    New password
                </button>
                <button className="new-key-btn"
                        onClick={toggleKeysPopup}>
                    <BsPlusCircleFill className="plus-icon"/>
                    New key
                </button>
            </div>

            <div className="passwords-container">
                <div className="passwords">
                    <h2>Passwords</h2>
                    {passwordEntries.map((item,index)=>(
                        <StoredPassword
                        setChanged={setChanged}
                        changed={changed}
                        type='password'
                        website={item.username}
                        password={item.password}
                        id={item._id}
                        index={index}
                        passwordEntries={passwordEntries}
                        setPasswordEntries={setPasswordEntries}
                        />
                    ))}
                    {/* <StoredPassword
                        website="www.youtube.com"
                        password="adkajflkajfl;" 
                    />
                    <StoredPassword
                        website="www.youtube.com"
                        password="adkajflkajfl;" 
                    /> */}
                </div>
                <div className="keys">
                    <h2>Keys</h2>
                    {keyEntries.map((item,index)=>(
                        <StoredPassword
                        setChanged={setChanged}
                        changed={changed}
                        type='key'
                        website={item.username}
                        password={item.password}
                        index={index}
                        id={item._id}
                        passwordEntries={keyEntries}
                        setPasswordEntries={setKeyEntries}
                        />
                    ))}
                    {/* <StoredPassword
                        website="www.facebook.com"
                        password="adadasas1o00;" 
                    /> */}
                </div>
            </div>

            {isOpen && <Popup
                    content={passwordsContent}
                    handleClose={togglePopup}
                />}
            {isKeysOpen && <KeysPopup
                    content={keysContent}
                    handleClose={toggleKeysPopup}
                />}
        </div>
    )
}

export default Dashboard
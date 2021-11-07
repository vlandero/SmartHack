import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {Error, Ok} from './statuses'
import {JWTsecret, MONGO} from './secrets'
import {generatePassword} from "./password_generator"
import {genRSA} from './generate-keys/keys'
import {encrypt,decrypt} from './crypt'
import forge from 'node-forge'

mongoose.connect(MONGO)

const app = express()
app.use(express.json())
app.use(express.static(__dirname+'/build'))
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    loginSalt: {type: String, required: true},
    cryptoSalt: {type: String, required: true},
    passwordEntries: {type: Array, required: false},
    keyEntries: {type: Array, required: false}
})

interface User {
    _id: number,
    username: string,
    password: string,
    loginSalt: string,
    cryptoSalt: string,
    passwordEntries: Array<Entry>
    keyEntries:Array<Entry>
}

const User: mongoose.Model<User> = mongoose.model<User>("user", userSchema)

interface Token {
    username: string,
}

interface Entry {
    username?:string,
    password:string,
    _id?:mongoose.Types.ObjectId
}

const verifyToken = async (req: express.Request<{}, {}, {}, {}, {}>, res: any) => {
    const token = req.header("authorization")
    let username = (jwt.verify(token!, JWTsecret) as Token)['username']
    const user = await User.findOne({username}).lean()
    if (!user) {
        return null
    }
    return user
}

app.get('/*', async (req, res) => {
    res.sendFile(__dirname+'/build/index.html');
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body
    const loginSalt = forge.random.getBytesSync(32);
    const cryptoSalt = forge.random.getBytesSync(32);
    console.log(username,password)
    const hashedPassword = await bcrypt.hash(password+loginSalt, 10)
    try {
        await User.create({
            username: username,
            password: hashedPassword,
            loginSalt,
            cryptoSalt,
            passwordEntries: [],
            keyEntries: [],
        })
        return res.json(Ok(''))
    } catch (err) {
        return res.json(err)
    }
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body
    let user = await User.findOne({username: username}).lean()
    console.log(user)
    if (!user)
        return res.json(Error('Invalid username'))
    if (await bcrypt.compare(password+user.loginSalt, user.password)) {
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWTsecret)
        return res.json(Ok(token))
    }
    return res.json(Error('Invalid password'))
})

app.post('/user/me', async (req, res) => {
    const user = await verifyToken(req, res)
    if (!user)
        return res.json(Error('User not logged in'))
    // console.log({
    //     username: user.username,
    //     passwordEntries: user.passwordEntries,
    //     keyEntries: user.keyEntries,
    //     cryptoSalt: user.cryptoSalt,
    // })
    return res.json(Ok({
        username: user.username,
        passwordEntries: user.passwordEntries,
        keyEntries:user.keyEntries,
        cryptoSalt: user.cryptoSalt,
    }))
})

app.post('/entries/', async (req: express.Request, res: express.Response) => {
    const user = await verifyToken(req, res)
    if (!user)
        return res.json(Error('User not logged in'))
    let dbKey = "";
    if (req.body.type === "passwords") {
        dbKey = "passwordEntries";
    } else {
        dbKey = "keyEntries";
    }
    const entryToAdd: Entry = {
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
    }
    try {
        await User.updateOne({username: user.username}, {
            $push: {
                [dbKey]: entryToAdd
            }
        })
        return res.json(Ok(entryToAdd._id))
        
    } catch (error) {
        return res.json(Error(error.toString()))
    }
})

app.delete('/entries/:type/:id/', async (req: express.Request, res) => {
    const user = await verifyToken(req, res)
    if (!user)
        return res.json(Error('User not logged in'))
    const entryId = req.params.id;
    try {
        if(req.params.type==='password'){
            await User.updateOne({username: user.username}, {
                $pull: {
                    passwordEntries: {_id: new mongoose.Types.ObjectId(entryId)}
                }
            })
            return res.json(Ok("Entry deleted"))
        }
        else{
            await User.updateOne({username: user.username}, {
                $pull: {
                    keyEntries: {_id: new mongoose.Types.ObjectId(entryId)}
                }
            })
            return res.json(Ok("Entry deleted"))
        }
    } catch (error) {
        return res.status(404).send(Error(error))
    }
})

// interface GeneratePasswordReqQuery {
//     length: number,
//     includeSymbols: boolean,
// }

// app.get('/generate-password', async (req: express.Request<{}, {}, {}, GeneratePasswordReqQuery, {}>, res) => {
//     const user = await verifyToken(req, res)
//     if (!user) {
//         return res.json(Error('User not logged in'))
//     }
//     return res.json(generatePassword(req.query))
// })

// console.log(genRSA())
// // console.log(genAES(16,'vlad'))
// let x = encrypt('curenta','parola') 
// console.log(Buffer.from(x.toHex(),'hex'),x)
// console.log(decrypt(x,'parola'))

app.listen(80, () => console.log("Server running"))
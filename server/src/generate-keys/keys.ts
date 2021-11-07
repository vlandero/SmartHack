import forge from 'node-forge'

export const genRSA = ()=>{
    let rsa = forge.pki.rsa;
    let keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    return {public:forge.pki.publicKeyToPem(keypair.publicKey),private:forge.pki.privateKeyToPem(keypair.privateKey)}
}


export const gen3DES = () => {
    
}
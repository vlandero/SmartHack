export const Error = (errorText:String)=>{
    return {status:'error',error:errorText}
}
export const Ok = (data:any)=>{
    return {status:'ok',data:data}
}
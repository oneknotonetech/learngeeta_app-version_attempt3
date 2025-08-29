export const setLoginData=(userInfo)=>{ //used as a setState 
    return (dispatch)=>{
        dispatch({
            type:'loginUser',
            payload:userInfo
        });
    }
    
}


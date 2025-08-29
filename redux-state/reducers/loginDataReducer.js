const reducer=(state='userInfo',action)=>{
    if(action.type==='loginUser'){
        return action.payload;
    }else{
        return state;
    }
}

export default reducer;
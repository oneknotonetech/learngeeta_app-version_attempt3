import { combineReducers } from "redux";
import loginDataReducer from './loginDataReducer'
const reducers=combineReducers({
    // increment:incrementReducer,         //used to get stateValue        
    // multiply:multiplyReducer,       //used to get stateValue        
    // sendData:sendDataReducers,      //used to get stateValue        
    getLoginUser:loginDataReducer,
   
})
export default reducers;
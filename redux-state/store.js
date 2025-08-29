import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

export const store=createStore(reducers,{},/*applyMiddleware(thunk)*/) 
//create a central store for all states and provide with src/index.js 
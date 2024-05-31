import axios from 'axios';
import {BASE_URL} from "../utills/ServiceUrls";

const API  = axios.create({baseURL: BASE_URL})

export const getMessages = (id) => API.get(`/message/findMessagesOfChat/${id}`);
export const addMessage = (message) => API.post("/message/sendMessage",message);
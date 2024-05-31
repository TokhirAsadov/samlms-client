import axios from 'axios';
import {BASE_URL} from "../utills/ServiceUrls";

const API  = axios.create({baseURL: BASE_URL})

export const userChats = (id) => API.get(`/chat/findUserChat/${id}`)

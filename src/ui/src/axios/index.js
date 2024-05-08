import axios from 'axios';


// const domain = "http://127.0.0.1:8000";
const domain = "";

const prefix = "/";

const TIME_OUT = 100000;
const ROOT_URL = `${domain}${prefix}`;
export const FORM_DATA_HEADER = {"Content-Type": "multipart/form-data"}
export const JSON_DATA_HEADER = {"Content-Type": "application/json"}

const client = axios.create({});
client.defaults.timeout = TIME_OUT;
client.defaults.baseURL = ROOT_URL;
export default client;


import axios from "axios";

const request = axios.create({
  baseURL: "http://3.109.62.210/",
});


export { request };

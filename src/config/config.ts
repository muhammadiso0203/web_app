import axios from "axios";

const request = axios.create({
  baseURL: "http://13.201.56.55/",
});


export { request };

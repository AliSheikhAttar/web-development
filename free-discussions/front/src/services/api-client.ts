import axios, { AxiosError } from "axios";

export default axios.create({
    baseURL: 'https://freediscussion.liara.run'
})

export { AxiosError } ;

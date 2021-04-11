import axios from "axios"

export default {
    async registerUser() {
        console.log('here in user service')
        let res = await axios.get("http://192.168.210.111:3000/api/register");
        console.log('res', res)
        return res.data;
    }
}
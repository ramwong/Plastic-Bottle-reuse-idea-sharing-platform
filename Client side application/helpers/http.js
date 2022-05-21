import axios from 'axios';

const serverURL = ""

export const postFunction = async (api, json) => {
    const { data } = await axios.post(serverURL + api, json);
    return data;
}


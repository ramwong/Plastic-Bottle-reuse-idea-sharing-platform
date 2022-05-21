import {postFunction} from "../helpers/http"
const memberRegisterAPI = "/api/member_register/";
const memberLoginAPI = "/api/member_login/";
const updatePasswordAPI = "/api/update_password/";

export const memberRegister = async (username, password) => {
    if (username && password) {
        const jsonObject = {
            "username":username,
            "password":password
        }
        const result = await postFunction(memberRegisterAPI, jsonObject);
        return result;
    }
    return false;
}

export const memberLogin = async (username, password) => {
    if (username && password) {
        const jsonObject = {
            "username":username,
            "password":password
        }
        const result = await postFunction(memberLoginAPI, jsonObject);
        return result;
    }
    return false;
}

export const updatePassword = async (username, currentPassword, newPassword) => {
    if (username && currentPassword && newPassword) {
        const jsonObject = {
            "username":username,
            "current_password":currentPassword,
            "password":newPassword
        }
        const result = await postFunction(updatePasswordAPI, jsonObject);
        return result;
    }
    return false;
}
import { postFunction } from "../helpers/http";
const createIdeaAPI = "/api/create_idea/";
const getOneIdeaAPI = "/api/get_one_idea/";
const getIdeaListAPI = "/api/get_idea_list/";
const getMemberIdeaListAPI = "/api/get_member_idea_list/";
const getRecommendationsListAPI = "/api/get_recommendations_list/";
const votingAPI = "/api/voting/";
const updateIdeaAPI = "/api/update_idea/";
const deleteIdeaAPI = "/api/delete_idea/";

export const createIdea = async (username, title, type, isMaterialNeed, source, contents, product) => {
    // check non empty
    if (username && title && type && source && product) {
        const jsonObject = {
            "username": username,
            "title": title,
            "type": type,
            "material_need": isMaterialNeed || false,
            "source": source,
            "contents": contents || [],
            "product": product,
        }
        const result = await postFunction(createIdeaAPI, jsonObject);
        return result;
    }
    return false;
}

export const getOneIdea = async (ideaID) => {
    if (ideaID) {
        const jsonObject = {
            "idea_id": ideaID
        }
        const result = await postFunction(getOneIdeaAPI, jsonObject);
        return result;
    }
    return false;
}

export const getIdeaList = async (types, isMaterialNeeds, order, quantity) => {
    
    if (types && order) {
        const jsonObject = {
            "types": types,
            "material_needs": isMaterialNeeds || [],
            "order": order,
            "quantity": quantity || 0
        }
        const result = await postFunction(getIdeaListAPI, jsonObject);
        return result;
    }
    return false;
}

export const getMemberIdeaList = async (username) => {
    
    if (username) {
        const jsonObject = {
            "username": username
        }
        const result = await postFunction(getMemberIdeaListAPI, jsonObject);
        return result;
    }
    return false;
}

export const getRecommendationsList = async (image, types, isMaterialNeeds, username, quantity) => {
    if (image) {
        const jsonObject = {
            "username": username,
            "image": image,
            "types": types || [],
            "material_needs": isMaterialNeeds || [],
            "quantity": quantity || 0
        }
        const result = await postFunction(getRecommendationsListAPI, jsonObject);
        return result;
    }
    return false;
}

export const voting = async (ideaID, imageName, username, score) => {
    if (ideaID && imageName && username) {
        const jsonObject = {
            "username": username,
            "image": imageName,
            "idea_id": ideaID,
            "score": score || 0
        }
        const result = await postFunction(votingAPI, jsonObject);
        return result;
    }
    return false;
}

export const updateIdea = async (ideaID, username, type, isMaterialNeed, title, source, contents, product) => {
    if (ideaID && username && type && title && source && product) {
        const jsonObject = {
            "idea_id": ideaID,
            "username": username,
            "title": title,
            "type": type,
            "material_need": isMaterialNeed || false,
            "source": source,
            "contents": contents || [],
            "product": product,
        }
        const result = await postFunction(updateIdeaAPI, jsonObject);
        return result;
    }
    return false;
}

export const deleteIdea = async (ideaID, username) => {
    if (ideaID && username) {
        const jsonObject = {
            "idea_id": ideaID,
            "username": username,
        }
        const result = await postFunction(deleteIdeaAPI, jsonObject);
        return result;
    }
    return false;
}
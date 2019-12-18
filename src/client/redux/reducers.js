import { IS_LOGGED_IN, DO_LOGIN, DO_LOGOUT } from "./actions";
import { GET_USERS, ADD_USER, DEL_USER } from "./actions";
import { GET_ROOMS, ADD_ROOM, DEL_ROOM, SELECT_ROOM } from "./actions";
import { GET_MEETINGS, ADD_MEETING, DEL_MEETING } from "./actions";

export default (state, action) => {

    switch (action.type) {
        case IS_LOGGED_IN :
            return {
                ...state,
                statusCode: action.statusCode,
                user: action.data,
                error: action.statusCode === 418 ? undefined : action.error
            };
        case DO_LOGIN :
        case DO_LOGOUT :
            return {
                ...state,
                statusCode: action.statusCode,
                user: action.data,
                error: action.error
            };
        case GET_USERS :
            return {
                ...state,
                statusCode: action.statusCode,
                users: action.data,
                error: action.error
            };
        case ADD_USER :
        case DEL_USER :
            return {
                ...state,
                statusCode: action.statusCode,
                users: action.statusCode === 200 ? undefined : state.users,
                error: action.error
            };
        case GET_ROOMS :
            return {
                ...state,
                statusCode: action.statusCode,
                rooms: action.data,
                error: action.error
            };
        case ADD_ROOM :
        case DEL_ROOM :
            return {
                ...state,
                rooms: action.statusCode === 200 ? undefined : state.rooms,
                error: action.error
            };
        case SELECT_ROOM :
            return {
                ...state,
                statusCode: action.statusCode,
                currentRoom: action.data,
                error: action.error
            };
        case GET_MEETINGS :
            return {
                ...state,
                statusCode: action.statusCode,
                meetings: action.data,
                error: action.error
            };
        case ADD_MEETING :
        case DEL_MEETING :
            return {
                ...state,
                meetings: action.statusCode === 200 ? undefined : state.meetings,
                error: action.error
            };
        default:
            return state || {};
    }
}
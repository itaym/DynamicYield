import { POST, GET, DELETE, options } from '../fetch';

export const IS_LOGGED_IN = Symbol('IS_LOGGED_IN');
export const DO_LOGIN = Symbol('DO_LOGIN');
export const DO_LOGOUT = Symbol('DO_LOGOUT');

export const GET_USERS = Symbol('GET_USERS');
export const ADD_USER = Symbol('ADD_USER');
export const DEL_USER = Symbol('DEL_USER');

export const GET_ROOMS = Symbol('GET_ROOMS');
export const ADD_ROOM = Symbol('ADD_ROOM');
export const DEL_ROOM = Symbol('DEL_ROOM');
export const SELECT_ROOM = Symbol('SELECT_ROOM');

export const GET_MEETINGS = Symbol('GET_MEETINGS');
export const ADD_MEETING = Symbol('ADD_MEETING');
export const DEL_MEETING = Symbol('DEL_MEETING');
export const SELECT_MEETING = Symbol('SELECT_MEETING');

export const isLoggedIn = () => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = GET;

    const response = await fetch('/isLoggedIn', fetchOptions);
    const json = await response.json();

    dispatch({
        type: IS_LOGGED_IN,
        ...json
    });
};

export const doLogin = (name, password) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = POST;
    fetchOptions.body = JSON.stringify({name, password});

    const response = await fetch('/login', fetchOptions);
    const json = await response.json();

    dispatch({
        type: DO_LOGIN,
        ...json
    });
};

export const doLogout = () => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = GET;

    const response = await fetch('/logout', fetchOptions);
    const json = await response.json();

    dispatch({
        type: DO_LOGOUT,
        ...json
    });
};

export const getUsers = () => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = GET;

    const response = await fetch('/users', fetchOptions);
    const json = await response.json();

    dispatch({
        type: GET_USERS,
        ...json
    });
};

export const addUser = (name, password) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = POST;
    fetchOptions.body = JSON.stringify({name, password});

    const response = await fetch('/users', fetchOptions);
    const json = await response.json();

    dispatch({
        type: ADD_USER,
        ...json
    });
};

export const delUser = (name) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = DELETE;
    fetchOptions.body = JSON.stringify({name});

    const response = await fetch('/users', fetchOptions);
    const json = await response.json();

    dispatch({
        type: DEL_USER,
        ...json
    });
};

export const getRooms = () => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = GET;

    const response = await fetch('/rooms', fetchOptions);
    const json = await response.json();

    dispatch({
        type: GET_ROOMS,
        ...json
    });
};

export const addRoom = (name) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = POST;
    fetchOptions.body = JSON.stringify({name});

    const response = await fetch('/rooms', fetchOptions);
    const json = await response.json();

    dispatch({
        type: ADD_ROOM,
        ...json
    });
};

export const delRoom = (name) => async (dispatch, getState) => {
    const fetchOptions = Object.assign({}, options);
    const state = getState();

    if (state.currentRoom && state.currentRoom.name === name) {
        dispatch({
            type: DEL_ROOM,
            statusCode: 401,
            data: null,
            error: 'You cannot remove the current selected room'
        });
        return;
    }
    fetchOptions.method = DELETE;
    fetchOptions.body = JSON.stringify({name});

    const response = await fetch('/rooms', fetchOptions);
    const json = await response.json();

    dispatch({
        type: DEL_ROOM,
        ...json
    });
};

export const selectRoom = (room) => async (dispatch) => {
    dispatch({
        type: SELECT_ROOM,
        statusCode: 200,
        data: room,
        error: null
    });
};

export const getMeetings = (name) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);

    fetchOptions.method = GET;

    const response = await fetch(`/meetings?name=${name}`, fetchOptions);
    const json = await response.json();

    dispatch({
        type: GET_MEETINGS,
        ...json
    });
};

export const addMeeting = (name, fromTime, toTime, description) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);
    fetchOptions.method = POST;
    fetchOptions.body = JSON.stringify({name, fromTime, toTime, description});

    const response = await fetch('/meetings', fetchOptions);
    const json = await response.json();

    dispatch({
        type: ADD_MEETING,
        ...json
    });
};

export const delMeeting = (name, fromTime, toTime) => async (dispatch) => {
    const fetchOptions = Object.assign({}, options);

    fetchOptions.method = DELETE;
    fetchOptions.body = JSON.stringify({name, fromTime, toTime});

    const response = await fetch('/meetings', fetchOptions);
    const json = await response.json();

    dispatch({
        type: DEL_MEETING,
        ...json
    });
};

export const APP_DOMAIN = "https://xxxxxx/coach";
export const API_URL = "https://app.xxxxxx/api/v1/coach"


export const FACEBOOK_APP_ID = '379822750854507';

export const UserStorage = () => {
    let userJson = JSON.parse(localStorage.getItem('user'));
    return userJson;
}

export const IsEmail = (email) => {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,3})+$/;
    var res = emailRegex.exec(email);
    return !!res;
}
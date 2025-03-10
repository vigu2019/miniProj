const serverUrl = "http://localhost:3000";
export const urls = {
    register: `${serverUrl}/v1/api/user/register`,
    login: `${serverUrl}/v1/api/user/login`,
    logout: `${serverUrl}/v1/api/user/logout`,
    updatePassword: `${serverUrl}/v1/api/user/update-password`,
    updateProfile: `${serverUrl}/v1/api/user/update-profile`,
    addPrint: `${serverUrl}/v1/api/user/print/addprint`,
    addOrder: `${serverUrl}/v1/api/store/addorder`,
    getOrders: `${serverUrl}/v1/api/store/orders`,
    getUserPrints: `${serverUrl}/v1/api/user/print/userprints`,
}
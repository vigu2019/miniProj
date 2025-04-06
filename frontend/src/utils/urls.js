const serverUrl = "https://miniproj-a42y.onrender.com";
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
    getUserOrders:`${serverUrl}/v1/api/store-staff/orders`,
    updateOrderStatus:`${serverUrl}/v1/api/store-staff/orders/status`,
    getAllPrints:`${serverUrl}/v1/api/print-staff/prints`,
    updatePrintStatus:`${serverUrl}/v1/api/print-staff/prints`,
    paymentVerification:`${serverUrl}/v1/api/store/payment/verify`,
    paymentVerificationPrint:`${serverUrl}/v1/api/print/payment/verify`,
}
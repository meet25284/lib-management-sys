export const emailvalidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}
export const passwordvalidation = (password) => {
    return password.length >= 8;
}

export default {emailvalidation,passwordvalidation};
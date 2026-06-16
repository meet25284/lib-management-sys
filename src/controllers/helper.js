import jwt from "jsonwebtoken";


export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token) => {
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    return verify?.id || null;
}

export default { createToken, verifyToken };

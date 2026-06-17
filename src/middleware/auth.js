import { verifyToken } from "../controllers/helper.js";
import User from "../models/UserSchema.js";

export const getMe = async (token) => {
    const id = verifyToken(token);
    const user = await User.findById(id);
    return user;
}

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        const user = await getMe(token)
        if (user?._id) {
            req.me = user;
            next();
        } else {
            throw new Error("Not authenticated")
        }
    } catch (err) {
        res.status(500).json({ message: err?.message });
    }

}

export const isLibrarian = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        const user = await getMe(token)
        if (user && user?.role === "librarian") {
            req.me = user;
            next();
        } else {
            throw new Error("Not authenticated as a librarian")
        }
    } catch (err) {
        res.status(500).json({ message: err?.message });
    }

}

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        const user = await getMe(token)
        if (user && user?.role === "admin") {
            req.me = user;
            next();
        } else {
            throw new Error("Not an admin")
        }
    } catch (err) {
        res.status(500).json({ message: err?.message });
    }

}


export const isMember = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        const user = await getMe(token)
        if (user && user?.role === "member") {
            req.me = user;
            next();
        } else {
            throw new Error("Not an member")
        }
    } catch (err) {
        res.status(500).json({ message: err?.message });
    }
}

export const isCreator = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        const user = await getMe(token)
        if ((user && user?.role === "admin") || (user && user?.role === "librarian")) {
            req.me = user;
            next();
        } else {
            throw new Error("Not an creator")
        }
    } catch (err) {
        res.status(500).json({ message: err?.message });
    }
}
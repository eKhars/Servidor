import Auth from "../models/auth.model.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Auth({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie("token", token);
        res.json({
            id: userSaved._id,
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
            email: userSaved.email,
        });

    } catch (error) {
        console.log(error);
      }
    };
    
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFound = await Auth.findOne({ email });
        if (!userFound) {
            return res.status(400).json(["Usuario no encontrado"]);
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = await createAccessToken({ id: userFound._id });
        res.cookie("token", token, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        res.json({
            id: userFound._id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
        });
    } catch (error) {
        console.log("Error al iniciar sesión:", error);
    }
}

export const logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
    const token = req.cookies;
    if (!token) return res.status(401).json({ message: "No estás autorizado" });
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) return res.status(401).json({ message: "Token inválido" });

        const userFound = await Auth.findById(user.id);

        if (!userFound) return res.status(401).json({ message: "No estás autorizado" });

        return res.json({
            id: userFound._id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
        });
    });
}

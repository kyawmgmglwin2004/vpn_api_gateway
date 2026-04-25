import StatusCode from "../../helper/statusCode.js";
import usersService from "./users_service.js";

async function userLogin(req, res) {
    try {
        const { phone, password } = req.body;
        const result = await usersService.userLogin(phone, password);
        res.status(result.code).json(result);   
    } catch (error) {
        console.error("Error user register action:", error);

        return res.status(500).json(StatusCode.UNKNOWN("SERVER ERROR"));
    }
}

async function userRegister(req, res) {
        
    try {
        const { name, phone, password } = req.body;
        const result = await usersService.userRegister(name, phone, password);
        res.status(result.code).json(result);   
    } catch (error) {
        console.error("Error user register action:", error);

        return res.status(500).json(StatusCode.UNKNOWN("SERVER ERROR"));
    }
}

async function getUserInfo(req, res) {
    try {
        const userId = req.user.id;
        const result = await usersService.getUserInfo(userId);
        res.status(result.code).json(result);   
    } catch (error) {
        console.error("Error user register action:", error);

        return res.status(500).json(StatusCode.UNKNOWN("SERVER ERROR"));
    }
}

export default {
  userLogin,
  userRegister,
  getUserInfo
};
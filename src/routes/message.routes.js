import { Router } from 'express';
import { createMessage, getMessages} from '../controllers/message.controller.js';
import { authRequired } from "../middlewares/validateToken.js";
import { config } from "dotenv";

config();

const router = Router();

router.get("/conversation/:id", authRequired, getMessages);
router.post("/message", authRequired, createMessage);

export default router;
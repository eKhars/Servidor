import { connectDB } from "./db.js";
import { config } from "dotenv";
import app from "./app.js";

config();
connectDB();

app.listen(process.env.PORT || 4000);
console.log("Server on port:", process.env.PORT || 4000);
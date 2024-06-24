import { app } from "./config/expressConfig";
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
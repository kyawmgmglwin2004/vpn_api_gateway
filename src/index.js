import express from "express";
import { config } from "./configs/config.js";
import router from "./router.js";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();


app.use(cors({
  origin: "*",

//   credentials: true
}));


app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("Hello world")
  res.json("This is testing ci cd runing......OKOKOK....HYMA")
})
app.use("/api/v1", router);
app.get("/test", (req, res) => {
  console.log("Uploads : ", req.params)
  res.send("KO kO")
})

console.log("App.JS port : ", config.PORT)


const PORT = config.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
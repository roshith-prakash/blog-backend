import http from "http";
import express from "express";
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import cloudinary from "./utils/cloudinary.cjs";
import upload from "./utils/multer.js";
dotenv.config()

import authRouter from "./routes/auth.routes.js"

// Initializing Server -------------------------------------------------------------------------------------------

const app = express();
let server = http.createServer(app, { allowEIO3: true });

// Using Middleware -------------------------------------------------------------------------------------------

const whitelist = ['http://localhost:3000']

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}


app.use(express.urlencoded());
app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())

// Routes -------------------------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.status(200).send("We are good to go!")
})

app.post('/upload', upload.single('file'), function (req, res) {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        }

        res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result
        })
    })
});

app.use("/auth", authRouter)



// Listening on PORT -------------------------------------------------------------------------------------------

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
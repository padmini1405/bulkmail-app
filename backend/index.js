const express = require("express")
const cors = require("cors")
require("dotenv").config();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

//Login functionality 

const PORT = process.env.PORT || 5000;

const mailhistory = mongoose.connection.collection("mailhistory");
const users = mongoose.connection.collection("users");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000
});

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({
            user: email,
            pass: password
        });
        if (user) {
            res.send({
                success: true
            });
        } else {
            res.send({
                success: false,
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Login failed"
        });
    }
});


//Signup functionality :

app.post("/signup", async function (req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await users.findOne({
            user: email
        });
        if (existingUser) {
            return res.send({
                success: false,
                message: "User already exists"
            });
        }
        await users.insertOne({
            user: email,
            pass: password
        });
        res.send({
            success: true,
            message: "Signup successful"
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Signup failed"
        });
    }
});


//Bulkmail functionality:

mongoose.connect(process.env.MONGO_URL).then(function () {
    console.log("Conneccted to DB");
}).catch(function (err) {
    console.log("Failed to Connect", err);
})



app.post("/sendmail", async function (req, res) {
    const msg = req.body.msg;
    const emailList = req.body.emailList;
    const subject = req.body.subject;
    try {
        // console.log("Trying SMTP connection...");
        // await transporter.verify();
        // console.log("SMTP Connected Successfully");

        for (const email of emailList) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                text: msg
            });
            console.log("Email sent to :", email);
        }

        await mailhistory.insertOne({
            subject: subject,
            body: msg,
            recipients: emailList,
            status: "Success",
            createdAt: new Date()
        });

        res.send(true);

    } catch (error) {

        console.log("MAIL ERROR FULL :", {
            message: error.message,
            code: error.code,
            response: error.response,
            responseCode: error.responseCode,
            command: error.command
        });

        await mailhistory.insertOne({
            subject: req.body.subject,
            body: req.body.msg,
            recipients: req.body.emailList,
            status: "Failed",
            createdAt: new Date()
        });

        res.send(false);
    }
});

app.get("/history", async (req, res) => {
    try {
        // Use 'mailhistory' instead of 'Email'
        // Add .toArray() because this is a raw collection instance
        const emails = await mailhistory.find().sort({ createdAt: -1 }).toArray();
        res.status(200).send(emails);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).send([]);
    }
});

app.listen(PORT, function () {
    console.log("Server started...")
})
const express = require("express")
const cors = require("cors")
require("dotenv").config();
const mongoose = require("mongoose")
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
    origin: "*"
}));

app.use(express.json());

//Login functionality 

const PORT = process.env.PORT || 5000;

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

const mailhistory = mongoose.connection.collection("mailhistory");
const users = mongoose.connection.collection("users");

app.post("/sendmail", async function (req, res) {

    try {
        const msg = req.body.msg;
        const emailList = req.body.emailList;
        const subject = req.body.subject;
    
        const response = await Promise.all(
            emailList.map(email =>
                resend.emails.send({
                    from: "onboarding@resend.dev",
                    to: email,
                    subject,
                    text: msg
                })
            )
        );
        console.log("Response : " ,response);
        console.log("Email sent successfully");

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
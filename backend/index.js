const express = require("express")
const cors = require("cors")
require("dotenv").config();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const app = express();

app.use(cors())
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
            email: email
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

const credential = mongoose.connection.collection("bulkmail");
const mailhistory = mongoose.connection.collection("mailhistory");
const users = mongoose.connection.collection("users");

app.post("/sendmail", async function (req, res) {

    try {

        var msg = req.body.msg;
        var emailList = req.body.emailList;
        var subject = req.body.subject;

        const data = await credential.find().toArray();

        console.log("Credential Data :", data);

        if (data.length === 0) {
            return res.send(false);
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].user,
                pass: data[0].pass,
            },
        });

        for (var i = 0; i < emailList.length; i++) {

            await transporter.sendMail({
                from: data[0].user,
                to: emailList[i],
                subject: subject,
                text: msg
            });

            console.log("Email sent to :", emailList[i]);
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

        console.log("MAIL ERROR :", error);

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

// app.get("/history", async (req, res) => {
//     try {
//         const emails = await Email.find().sort({ createdAt: -1 });
//         res.send(emails);
//     } catch(error) {
//         res.send([]);
//     }
// });

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

app.listen(5000, function () {
    console.log("Server started...")
})
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userroutes from "./routes/user.js"
import questionroutes from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import bodyParser from 'body-parser';
const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());


// Middleware
app.use(bodyParser.json());


app.use("/user", userroutes);
app.use('/questions', questionroutes)
app.use('/answer', answerroutes)
app.get('/', (req, res) => {
    res.send("Codequest is running perfect")
})

app.post('/send-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Set up nodemailer transport
    let transporter = nodemailer.createTransport({
        service: 'your-email-service-provider', // e.g., 'gmail'
        auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password',
        },
    });

    // Define email options
    let mailOptions = {
        from: 'your-email@example.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ message: 'Failed to send OTP', error });
    }
});

const PORT = process.env.PORT || 5000
const database_url = process.env.MONGODB_URL

mongoose.connect(database_url)
    .then(() => app.listen(PORT, () => { console.log(`server running on port ${PORT}`) }))
    .catch((err) => console.log(err.message))
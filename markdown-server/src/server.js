import express from "express";
import dotenv from "dotenv";


const app = express()
dotenv.config()

const PORT = process.env.PORT;

app.get('/', function (req, res) {
    res.json({ nigga: 'please' })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
});
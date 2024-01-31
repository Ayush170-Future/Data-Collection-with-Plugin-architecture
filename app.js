// Form: createForm
// Add questions
// Add responce (formid, questionid)

require('dotenv').config();
const errorHandler = require("./middleware/errorHandler.js");
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/form/", require("./routes/formRoute"));
app.use("/response/", require("./routes/responseRoute"));
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to Mongoose");
}).catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
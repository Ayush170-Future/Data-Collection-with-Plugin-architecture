const asyncHalder = require("express-async-handler");
const Form = require("../models/formModel");
const Question = require("../models/questionModel");
const Response = require("../models/responseModel");
const mongoose = require('mongoose');

const addResponseToAForm = asyncHalder(async (req, res, next) => {

    const { responses } = req.body;
    const form_id = req.params.id;

    if (!form_id) {
        res.status(400)
        throw new Error("All fields are mandatory: Form ID");
    }

    const form = await Form.findOne({ _id: form_id });

    if (!form) {
        res.status(400)
        throw new Error("Form doesn't exist!");
    }

    // Set contains the ID of all the questions answered by the User
    let questions_answered_set = new Set();

    for (const { questionId } of responses) {
        questions_answered_set.add(questionId);
    }

    // Checking if the User has answered all the required questions in the form or not
    for (const questionId of form.questions) {
        const question = await Question.findOne({ _id: questionId });

        if (!question) {
            console.log("Required question not found:", questionId);
        }

        if (question.required) {
            const questionIdAsString = String(question._id);
            if (!questions_answered_set.has(questionIdAsString)) {
                res.status(400)
                throw new Error("Answer all the required Questions: " + questionId);
            }
        }
    }

    console.log("Reached here2");

    const responseJSON = new Object();

    // Saving all the responses in the DB
    for (const { questionId, responseText } of responses) {
        const question = await Question.findOne({ _id: questionId });

        if (!question) {
            res.status(400)
            throw new Error("Question not present", questionId);
        }

        const response = new Response({ formId: form, questionId: question, responseText: responseText });
        const result = await response.save();
        responseJSON[question.questionText] = responseText;
        
        if (!result) {
            res.status(500)
            throw new Error("Internal Server Error: Couldn't save the Response in the Form of questionId: " + questionId);
        }
    }

    res.status(200);
    const result = { "Result": "Successfully added responses" };
    res.result = result;
    res.responseJSON = responseJSON;
    res.formId = form_id;
    next();
});

const responseEventEmitter = asyncHalder((req, res) => {

    const dataCollectionApp = global.dataCollectionApp;
    dataCollectionApp.emit('ResponseGenerated', res.responseJSON, res.formId);

    res.status(200).json({
        title: "OK",
        message: "Request successful",
        result: res.result,
    });
});

module.exports = {addResponseToAForm, responseEventEmitter};
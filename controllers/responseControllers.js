const asyncHandler = require("express-async-handler");
const Form = require("../models/formModel");
const Question = require("../models/questionModel");
const logger = require('../logger/index.js');

const addResponseToAForm = asyncHandler(async (req, res, next) => {
    const { responses } = req.body;
    const form_id = req.params.id;

    if (!form_id) {
        logger.warn("addResponseToAForm - Missing form_id");
        res.status(400);
        throw new Error("All fields are mandatory: Form ID");
    }

    const form = await Form.findOne({ _id: form_id });

    if (!form) {
        logger.warn("addResponseToAForm - Form doesn't exist");
        res.status(400);
        throw new Error("Form doesn't exist!");
    }

    let questions_answered_set = new Set();

    for (const { questionId } of responses) {
        questions_answered_set.add(questionId);
    }

    for (const questionId of form.questions) {
        const question = await Question.findOne({ _id: questionId });

        if (!question) {
            logger.warn("addResponseToAForm - Required question not found:", questionId);
        }

        if (question.required) {
            const questionIdAsString = String(question._id);
            if (!questions_answered_set.has(questionIdAsString)) {
                logger.warn("addResponseToAForm - Answer all the required Questions:", questionId);
                res.status(400);
                throw new Error("Answer all the required Questions: " + questionId);
            }
        }
    }

    const responseJSON = new Object();

    for (const { questionId, responseText } of responses) {
        const question = await Question.findOne({ _id: questionId });

        if (!question) {
            logger.warn("addResponseToAForm - Question not present", questionId);
            res.status(400);
            throw new Error("Question not present", questionId);
        }

        const response = new Response({ formId: form, questionId: question, responseText: responseText });
        const result = await response.save();

        if (!result) {
            responseJSON[question.questionText] = responseText;
            logger.error("addResponseToAForm - Internal Server Error: Couldn't save the Response in the Form of questionId:", questionId);
            res.status(500);
            throw new Error("Internal Server Error: Couldn't save the Response in the Form of questionId: " + questionId);
        }
    }

    logger.info("addResponseToAForm - Responses added successfully");
    res.status(200);
    const result = { "Result": "Successfully added responses" };
    res.result = result;
    res.responseJSON = responseJSON;
    res.formId = form_id;
    next();
});

const responseEventEmitter = asyncHandler((req, res) => {
    const dataCollectionApp = global.dataCollectionApp;
    dataCollectionApp.emit('ResponseGenerated', res.responseJSON, res.formId);

    logger.info("responseEventEmitter - ResponseGenerated event emitted");
    res.status(200).json({
        title: "OK",
        message: "Request successful",
        result: res.result,
    });
});

module.exports = { addResponseToAForm, responseEventEmitter };

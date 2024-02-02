const asyncHandler = require("express-async-handler");
const Form = require("../models/formModel");
const Question = require("../models/questionModel");
const logger = require('../logger/index.js');

const createForm = asyncHandler(async (req, res, next) => {
    const { title, description, createdBy, questions } = req.body;

    if (!title) {
        logger.warn("createForm - Missing title");
        res.status(400);
        throw new Error("All fields are mandatory: Title");
    }

    const form = new Form({
        title: title,
        description: description,
        createdBy: createdBy
    });

    // Saving the Form
    const savedForm = await form.save();

    if (!savedForm) {
        logger.error("createForm - Failed to save the Form");
        res.status(500);
        throw new Error("Internal Server Error: Couldn't save the Form");
    }

    // Adding all the Questions
    for (const { questionText, required } of questions) {
        if (!questionText) continue;
        const question = new Question({
            questionText: questionText,
            required: required,
            formId: savedForm._id,
        });

        const savedQuestion = await question.save();
        savedForm.questions.push(savedQuestion);
    }

    const result = await savedForm.save();
    if (result) {
        logger.info(`createForm - Form created successfully for Form ID ${result._id}`);
        res.status(200);
        res.status(200);
        res.result = result;
        next();
    } else {
        logger.error("createForm - Failed to save the Questions in the Form");
        res.status(500);
        throw new Error("Internal Server Error: Couldn't save the Questions in the Form");
    }
});

const addQuestions = asyncHandler(async (req, res, next) => {
    const { questions } = req.body;
    const form_id = req.params.id;

    if (!questions || !form_id) {
        logger.warn("addQuestions - Missing questions or form_id");
        res.status(400);
        throw new Error("All fields are mandatory: Question, Form ID");
    }

    const form = await Form.findOne({ _id: form_id });

    if (!form) {
        logger.warn("addQuestions - Form doesn't exist");
        res.status(400);
        throw new Error("Form doesn't exist!");
    }

    const questionsArray = [];

    // Adding all the Questions
    for (const { questionText, required } of questions) {
        if (!questionText) continue;
        const question = new Question({
            questionText: questionText,
            required: required,
            formId: form_id,
        });

        const savedQuestion = await question.save();
        form.questions.push(savedQuestion._id);
        questionsArray.push(questionText);

        logger.info(`addQuestions - Question saved successfully for Form ID ${form_id}: ${questionText}`);
    }

    const result = await form.save();
    if (result) {
        logger.info(`addQuestions - Questions added successfully for Form ID ${form_id}`);
        res.result = result;
        res.formId = form_id;
        res.questionsArray = questionsArray;
        next();
    } else {
        logger.error("addQuestions - Failed to save the Questions in the Form");
        res.status(500);
        throw new Error("Internal Server Error: Couldn't save the Questions in the Form");
    }
});

const createFormEventEmitter = asyncHandler(async (req, res, next) => {
    const dataCollectionApp = global.dataCollectionApp;
    dataCollectionApp.emit('FormCreated', res.result);

    logger.info("createFormEventEmitter - FormCreated event emitted");
    res.status(200).json({
        title: "OK",
        message: "Successfully Created the Form!",
        result: res.result,
    });
});

const addQuestionsEventEmitter = asyncHandler(async (req, res, next) => {
    const dataCollectionApp = global.dataCollectionApp;
    dataCollectionApp.emit("QuestionsAdded", res.questionsArray, res.formId);

    logger.info("addQuestionsEventEmitter - QuestionsAdded event emitted");
    res.status(200).json({
        title: "OK",
        message: "Request successful",
        result: res.result,
    });
});

module.exports = { createForm, addQuestions, createFormEventEmitter, addQuestionsEventEmitter };
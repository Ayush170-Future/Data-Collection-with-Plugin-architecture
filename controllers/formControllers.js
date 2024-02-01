const asyncHalder = require("express-async-handler");
const Form = require("../models/formModel");
const Question = require("../models/questionModel");

const createForm = asyncHalder(async(req, res, next) => {
    const {title, description, createdBy, questions} = req.body;

    if(!title) {
        res.status(400)
        throw new Error("All fields are mendatory: Title")
    }

    const form = new Form({
        title: title,
        description: description,
        createdBy: createdBy
    });

    // Saving the Form
    const savedForm = await form.save();

    if(!savedForm) {
        res.status(500)
        throw new Error("Internal Server Error: Couldn't save the Form")
    }

    // Adding all the Questions
    for (const {questionText, required} of questions) {
        if(!questionText) continue;
        const question = new Question({
            questionText: questionText,
            required: required,
            formId: savedForm._id,
        });

        const savedQuestion = await question.save();
        savedForm.questions.push(savedQuestion);
    }

    const result = await savedForm.save();
    if(result) {
        res.status(200);
        res.locals.data = { result };
        next();
    } else {
        res.status(500)
        throw new Error("Internal Server Error: Couldn't save the Questions in the Form")
    }
})

const addQuestions = asyncHalder(async(req, res, next) => {
    const {questions} = req.body;
    const form_id = req.params.id;

    if(!questions || !form_id) {
        res.status(400)
        throw new Error("All fields are mendatory: Question, Form ID")
    }

    const form = await Form.findOne({_id: form_id});

    if(!form) {
        res.status(400)
        throw new Error("Form doesn't exist!")
    }

    // Adding all the Questions
    for (const {questionText, required} of questions) {
        if(!questionText) continue;
        const question = new Question({
            questionText: questionText,
            required: required,
            formId: form_id,
        });

        const savedQuestion = await question.save();
        form.questions.push(savedQuestion._id);
    }

    const result = await form.save();
    if(result) {
        res.status(200);
        res.result = result;
        next();
    } else {
        res.status(500)
        throw new Error("Internal Server Error: Couldn't save the Questions in the Form")
    }
});

const createFormEventEmitter = asyncHalder(async (req, res, next) => {

    const dataCollectionApp = global.dataCollectionApp;
    dataCollectionApp.emit('FormCreated', res.result);

    res.status(200).json({
        title: "OK",
        message: "Request successful",
        result: res.result,
    });
});

module.exports = {createForm, addQuestions, createFormEventEmitter};
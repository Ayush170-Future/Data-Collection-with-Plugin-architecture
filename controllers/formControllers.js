const asyncHalder = require("express-async-handler");
const Form = require("../models/formModel");
const Question = require("../models/questionModel");

// title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   createdBy: {
//     type: String, // Email of the creator
//   },
//   questions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Question'
//   }],


// question: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   required: {
//     type: Boolean,
//     default: false,
//   }
// formId: {
//     type: mongoose.Schema.Types.ObjectId,    // In Future we might have a use-case where we want to fetch question based upon FormID
//     ref: 'Form',                             // Little optimization in speed wrt increase in redundency
//   },

const createForm = asyncHalder(async(req, res) => {
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
        res.status(200).json({ result });
    } else {
        res.status(500)
        throw new Error("Internal Server Error: Couldn't save the Questions in the Form")
    }
})

const addQuestions = asyncHalder(async(req, res) => {
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
        res.status(200).json({ result });
    } else {
        res.status(500)
        throw new Error("Internal Server Error: Couldn't save the Questions in the Form")
    }
})

module.exports = {createForm, addQuestions};
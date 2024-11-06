const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String,
    role: String
})

const FormDataModel = mongoose.model('log_reg_forms', FormDataSchema);

module.exports = FormDataModel;

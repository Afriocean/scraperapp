const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RemarkSchema = new Schema({
    body: String
});

const Remark = mongoose.model('Remark', RemarkSchema);

module.exports = Remark;
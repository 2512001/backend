const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
    title: {
        type: String,
        maxLength: 20
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
}, { timestamps: true });   

const Project = mongoose.model('project', projectSchema);
module.exports = Project;
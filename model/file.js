const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = Schema({
    name : {
        type : String,
        maxLength : 100,
        required : true
    },
    url : {
        type : String
    },
    transcript : {
          type : String,
          required : true,
          maxLength : 1000
    },
    projectId : {
        type :  Schema.Types.ObjectId,
        ref : "project"
    }
}, { timestamps: true });

const file = mongoose.model('file' , fileSchema);
module.exports = file;
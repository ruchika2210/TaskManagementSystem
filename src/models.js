const mongoose = require('mongoose');


//Id is implicitly created by mongodb using '_id'

const TaskManagementSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true,
    },

    description :{
        type : String,
        required : true,
    },

    status : {
        type : String,
        enum :['Pending','In Progress', 'Completed'],
        default:'Pending',
    },

    created_at :{
        type : Date,
        default:Date.now(),
    },

    updated_at : {
        type: Date,
        default:Date.now(),
    }
})

// for the updating the field
TaskManagementSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const TaskManagement = mongoose.model('TaskManagement', TaskManagementSchema);

module.exports = TaskManagement;


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_TASK_API,{
    useNewUrlParser : true,
    useCreateIndex : true,

});



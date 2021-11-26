const { Schema,model } = require("mongoose");

const User = new Schema({
    name: String,
    lastname:String,
    email: String,
    imageURL:String,
    public_id:String
});

module.exports = model('User',User);
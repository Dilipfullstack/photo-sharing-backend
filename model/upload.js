const mongoose = require("mongoose");

const uploadSchema = mongoose.Schema({
    image: String
})

const upload = mongoose.model("Upload", uploadSchema);
module.exports = upload;
const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    name: String,
    location: String,
    likes: String,
    description: String,
    postImage: {
        data: String,
        contentType: String
    },
    date: String,
    created: String
});

//Sarthak Blog
// const PostSchema = mongoose.Schema({
//     name: String,
//     location: String,
//     likes: String,
//     description: String,
//     postImage: {
//         type: Buffer,
//         required: [true, 'uploaded pic must have a name']
//     },
//     date: String
// });

const post = mongoose.model('post', PostSchema);

module.exports = post;
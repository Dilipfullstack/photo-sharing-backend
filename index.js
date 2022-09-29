const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const postModel = require('./model/post');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
const clientURL = "https://image-upload-ds.herokuapp.com";
// const clientURL = "http://localhost:3000"

// middleware
app.use(bodyParser.json({limit: "30mb"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public',express.static('public'));
app.use('/uploads',express.static('uploads'));

app.use(cors());

// templating
app.set('view engine', 'ejs');

// database connect
mongoose.connect(process.env.MONGO_URI, () => {
    console.log('connected to DB insta_clone')
});

app.get('/createpost', (req, res) => {
    res.render('form');
});

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: function(req, file, cb) {
        // let test = "testname";
        // let key = 0;
        cb(null, Date.now() + file.originalname);
        // cb(null, test + key);
        // key++;
    }
});

const upload = multer({
    storage: Storage
}).single('myFile')

// uplaod.single has been added later and later function has been made async
app.post('/post', (req, res) => {
    const likes = 30;
    const date = new Date();
    const dateArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    console.log(req.file);
    // const post = new postModel({
    //     name: req.body.name,
    //     location: req.body.location,
    //     likes: `${likes} likes`,
    //     description: req.body.description,
    //     postImage: req.body.postImage,
    //     date: date.getDate() + " " + dateArr[date.getMonth()] + " " + date.getFullYear()
    // });

    // post.save().then(doc => {
    //     console.log(doc);
    // }).catch(err => {
    //     console.log(err);
    // });

    // res.redirect('/home');


    upload(req, res, (err) => {
        if(err) {
            console.log(err);
        } else {
            const post = new postModel({
                name: req.body.name,
                location: req.body.location,
                likes: `${likes} Likes`,
                description: req.body.description,    
                postImage: {
                    data: req.file.filename,
                    contentType: 'image/png'
                },
                date: date.getDate() + " " + dateArr[date.getMonth()] + " " + date.getFullYear(),
                created: "" + Date.now()
            })
            post.save()
            .then(() => res.redirect(`${clientURL}/home`))
            .catch(err => console.log(err));
        }
    });

    // upload(req, res, (err) => {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         const post = new postModel({
    //             name: req.body.name,
    //             location: req.body.location,
    //             likes: `${likes} likes`,
    //             description: req.body.description,    
    //             postImage: {
    //                 data: req.body.postImage.filename,
    //                 contentType: 'image/png'
    //             },
    //             date: date.getDate() + " " + dateArr[date.getMonth()] + " " + date.getFullYear()
    //         })
    //         post.save()
    //         .then(() => res.send(post))
    //         .catch(err => console.log(err));
    //     }
    // });

    // Sarthak blog
    // try {
    //     const post = await postModel.create({
    //         name: req.body.name,
    //         location: req.body.location,
    //         likes: `${likes} likes`,
    //         description: req.body.description,    
    //         postImage: req.file.filename,
    //         date: date.getDate() + " " + dateArr[date.getMonth()] + " " + date.getFullYear()
    //     })
    //     res.status(200).json({
    //         status: 'Success',
    //         message: 'File Created Successfully'
    //     })
    // } catch(error) {
    //     res.json(error)
    // }


});

app.get('/home', (req, res) => {
    postModel.find((err, docs) => {
        res.json(docs);
        // console.log(docs)
    });
    // console.log(postData);
});

app.get('/api', (req, res) => {
    res.json({"message": 'Hello World'});
});

app.post("/upload", (req, res)=> {
    uploadModel.create(req.body).then((data)=> {
        res.status(200).send(data)
})
});

app.get("/images", (req, res)=> {
    uploadModel.find().then((imageData)=> {
        res.status(200).send({images: imageData})
    })
});

app.listen(process.env.PORT || 3001, () => {
    console.log('server started on port 3001');
});
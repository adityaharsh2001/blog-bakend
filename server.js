const express = require('express')
const mongoose = require('mongoose')
// Declearing the Route Variables
const methodOverride = require('method-override')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const app = express();
require('dotenv/config');

//Connect Backend To MongoDB
(async function(){
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Connected To MongoDB');
    }catch(err){
        console.log(err);
        process.exit(1);
    }
})();

//set EJS as Templating Engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

//Home Page Route
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
});
app.use(express.static(__dirname + '/public'));
app.use('/articles', articleRouter)

const port = process.env.PORT || 5000;
app.listen(port,() => console.log(`Server is running on port ${port}...`)); 
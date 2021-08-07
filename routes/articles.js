const express = require("express");
const Article = require("./../models/article");
const router = express.Router();
const multer = require("multer");

//define storage for the images

var storage = multer.diskStorage({    
  destination: function (req, file, cb) {      
  cb(null, 'public/uploads/images')    
  }, 
     
  filename: function (req, file, cb) {      
  cb(null, new Date().toISOString()+file.originalname
  )    
  }  
  })

//upload parameters for multer
const upload = multer({
  storage: storage,
  
});

//-----------Routes-------------//

//new route
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

//edit route
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

//view article route
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

//--------------CRUD OPERATIONS--------------//

//Route to handle the new Post
router.post("/", upload.single('image'), async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);



//edit the created article
router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

//delete handler
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

//controllers for CRUD operations
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    article.cat = req.body.cat;
    // article.img = req.file.filename;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;

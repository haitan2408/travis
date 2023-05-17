import {Router} from 'express';
import {Book} from "../model/book.model";
import {Category} from "../model/category.model";
import {Publishing} from "../model/publishing.model";

const bookRouter = Router();

declare module 'express-session' {
    export interface SessionData {
        success: string;
    }
}

bookRouter.get("", async (req, res) => {
    try {

        let keywordSearch = "";
        if (req.query.keyword) {
            keywordSearch = req.query.keyword + "";
        }

        let categorySearch = req.query.category;
        let success = "";
        let sessionData = req.session;
        if (sessionData) {
            success = sessionData.success;
            sessionData.success = null;
        }
        let publishingSearch = "";
        let books = [];
        if (req.query.publishing || categorySearch != "none") {
            if(categorySearch == "none") {
                publishingSearch = req.query.publishing + "";
                let publishing = await Publishing.findOne({name: {$regex: publishingSearch}})
                books = await Book.find({
                    "keywords.keyword": {$regex: keywordSearch},
                    "publishing": publishing
                }).populate({
                    path: "category", select: "name"
                }).populate({
                    path: "publishing", select: "name"
                });
            } else if(!req.query.publishing) {
                let category = await Category.findOne({_id: categorySearch});
                books = await Book.find({
                    "keywords.keyword": {$regex: keywordSearch},
                    "category": category
                }).populate({
                    path: "category", select: "name"
                }).populate({
                    path: "publishing", select: "name"
                });
            } else {
                publishingSearch = req.query.publishing + "";
                let publishing = await Publishing.findOne({name: {$regex: publishingSearch}});
                let category = await Category.findOne({_id: categorySearch});
                books = await Book.find({
                    "keywords.keyword": {$regex: keywordSearch},
                    "publishing": publishing,
                    "category": category
                }).populate({
                    path: "category", select: "name"
                }).populate({
                    path: "publishing", select: "name"
                });
            }

        } else {
            books = await Book.find({
                "keywords.keyword": {$regex: keywordSearch}
            }).populate({
                path: "category", select: "name"
            }).populate({
                path: "publishing", select: "name"
            });
        }
        let listCategory = await Category.find();
        res.render("list", {data: books, success: success, categories: listCategory});
    } catch (e) {
        res.render("error");
    }
});

bookRouter.post('/create', async (req, res) => {
    try {
        let categoryNew = await Category.findOne({name: req.body.category});
        if (!categoryNew) {
            categoryNew = new Category({
                name: req.body.category
            });
            await categoryNew.save();
        }
        let publishingNew = await Publishing.findOne({name: req.body.publishing});
        if (!publishingNew) {
            publishingNew = new Publishing({
                name: req.body.publishing
            });
            await publishingNew.save();
        }

        const bookNew = new Book({
            name: req.body.name,
            author: req.body.author,
            category: categoryNew,
            publishing: publishingNew
        });
        bookNew.keywords.push({keyword: req.body.keyword});


        const book = await bookNew.save();
        if (book) {
            let sessionData = req.session;
            sessionData.success = "create";
            res.redirect("/book");
        } else {
            res.render("error");
        }
    } catch (err) {
        res.render("error");
    }
});

bookRouter.get('/create', (req, res) => {
    res.render("create");
});

export default bookRouter;

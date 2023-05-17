import {Schema, model} from "mongoose";

interface IBook {
    category: string;
    name: string;
    author: string;
    keywords: object[];
    publishing: string
}

const keywordsSchema = new Schema({
    keyword: String
});

const bookSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    name: String,
    author: String,
    keywords: [keywordsSchema],
    publishing: {type: Schema.Types.ObjectId, ref: "Publishing"}
})

const Book = model<IBook>('Book', bookSchema);
export { Book };

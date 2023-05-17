import {Schema, model} from "mongoose";

interface IPublishing {
    name: string
}

const publishingSchema = new Schema<IPublishing>({
    name: String
})

const Publishing = model<IPublishing>('Publishing', publishingSchema);

export { Publishing };

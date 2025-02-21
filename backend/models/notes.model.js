import mongoose, {Schema} from "mongoose";

const notesSchema = new Schema({
    owner: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    undo : {
        type: Boolean,
        required : true,
        default:false
    }
},{timestamps:true})

export const Note = mongoose.model("Note",notesSchema)
import mongoose , { Schema } from "mongoose";

const messageSchema = new Schema({

    sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        requireed : true,
    },

    receiver : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    text : {
        type : String,
    },

    seen : {
        type: Boolean,
        default: false,
    },

},

    {timestamps : true}

);

export const Message = mongoose.model("Message",messageSchema);
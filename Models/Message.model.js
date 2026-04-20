import mongoose , { Schema } from "mongoose";

const messageSchema = new Schema({

    sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    text : {
        type : String,
    },

    seen : {
        type: Boolean,
        default: false,
    },

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
        },

},

    {timestamps : true}

);

messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ receiver: 1, seen: 1 });

export const Message = mongoose.model("Message",messageSchema);
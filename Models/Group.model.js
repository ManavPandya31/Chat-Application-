import mongoose , { Schema } from "mongoose";

const groupSchema = new Schema({

    name : {
        type : String,
        required : true,
    },

     members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
}, {timestamps : true});

export const Group = mongoose.model("Group",groupSchema)

const { Schema, model } = require('mongoose');
const moment = require('moment');
const ReactionSchema = require("./Reaction")

// Reactions are subdocuments
// https://mongoosejs.com/docs/subdocs.html#adding-subdocs-to-arrays

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: function(thoughtText) {
            return thoughtText.length >= 1 && thoughtText.length <= 280;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function(createdAt) {
            return moment(createdAt).format("m/d/YYYY HH:MM:SS");
        }
    },
    username: {
        type: String,
        required: true
    },
    reactions: [
        ReactionSchema
    ]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false,
    timestamps: { createdAt: 'created_at' }
});

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
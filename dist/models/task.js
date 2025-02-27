import * as Index from "../index.js";

const taskSchema = new Index.mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        // assignedTo: {
        //     type: Index.mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true
        // }, for single
        //if tasks can have multiple assignees
        assignedTo: [{
            type: Index.mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'on-hold'],
            default: "pending"
        },
    },
    { timestamps: true, strict: false }
);

// Create an index on 'assignedTo' for faster searches
taskSchema.index({ assignedTo: 1 });

const Task =Index.mongoose.model("Task", taskSchema);
export { Task }

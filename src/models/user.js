import * as Index from "../index.js";

const userSchema = new Index.mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        profile: {
            type: String,
            required: false,
        },

        password: {
            type: String,
            required: false,
            default: null,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        forgotKey: {
            type: String,
            required: false,
        },
        tasks: [{
            type: Index.mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, strict: false }
);
userSchema.index({ email: 1 }, { unique: true });
const User = Index.mongoose.model("User", userSchema);
export { User };

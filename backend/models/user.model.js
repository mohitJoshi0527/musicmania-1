import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your name"],
            minLength: [4, "Name should be at least 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            unique: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        purchasedFiles: {
            type: [mongoose.Schema.Types.ObjectId], // Array of Song IDs
            ref: "Song",
            default: [], // Ensure it's initialized as an empty array
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

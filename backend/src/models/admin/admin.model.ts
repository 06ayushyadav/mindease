import mongoose from "mongoose";

type AdminType={
    name:string,
    email:string,
    password:string,
    role:string
}

const AdminSchema = new mongoose.Schema<AdminType>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin"] }
}, { timestamps: true });

const AdminModel = mongoose.model<AdminType>("Admin", AdminSchema);

export default AdminModel;

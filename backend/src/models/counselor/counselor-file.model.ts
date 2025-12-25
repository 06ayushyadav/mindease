import mongoose from "mongoose";

type fileSchema={
    profilePic:string,
    certificate:string,
    counselorId:mongoose.Schema.Types.ObjectId
}

const fileSchema=new mongoose.Schema<fileSchema>({
    counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counselor",
    required: true,
  },
    profilePic:{type:String},
    certificate:{type:String}
},
{ timestamps: true }
)

const CounselorFile= mongoose.model<fileSchema>("counselorfile",fileSchema);

export default CounselorFile
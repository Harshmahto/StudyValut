import mongoose , {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const pdfSchema = new Schema(
    {
        owner:{
            type : String,
            required : true
        },
        pdfName:{
            type: String,
            lowercase: true,
            trime: true,
            required: true
        },
        subject:{
            type: String,
            required: true,
            lowercase: true,
            trime: true
        },
        semester:{
            type: String,
            required: true,
        },
        categories:{
            type: String,
            required: true,
            lowercase: true,
            trime: true
        },
        pdfFile:{
            type: String, // store the link form cloudinary
            required :true,

        },
        pyqYear:{
            type:Number
        }
        


    },{timestamps:true}
)

pdfSchema.plugin(mongooseAggregatePaginate)

export const Pdf = mongoose.model("Pdf",pdfSchema)
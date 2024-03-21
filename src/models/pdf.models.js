import mongoose , {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const pdfSchema = new Schema(
    {
        owner:{
            type : Schema.Types.ObjectId,
            ref: "User"
        },
        pdfName:{
            type: String,
            required: true
        },
        subject:{
            type: String,
            required: true
        },
        semester:{
            type: String,
            required: true
        },
        semester:{
            type: String,
            required: true
        },
        categories:{
            type: String,
            required: true
        },
        pyqYear:{
            type:Number
        }
        


    },{timestamps:true}
)

pdfSchema.plugin(mongooseAggregatePaginate)

export const Pdf = mongoose.model("Pdf",pdfSchema)
// NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Other Dependencies
import { ObjectId } from 'mongoose';


export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})
export class User {
    @Prop({
        type: String,
        required: true
    })
    _id: ObjectId;

    @Prop({
        type: String,
        required: true,
        minlength: 3
    })
    firstname: string;

    @Prop({
        type: String,
        required: true,
        minlength: 3
    })
    lastname: string;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string;


    @Prop({
        type: String,
        default: null
    })
    profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
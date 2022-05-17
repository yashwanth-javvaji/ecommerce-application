// NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Common
import { Role } from "@yj-major-project/common";

// Other Dependencies
import * as bcrypt from 'bcrypt';
import { Document, ObjectId } from 'mongoose';


export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.currentHashedRefreshToken;
        }
    }
})
export class User {
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
        required: true
    })
    password: string;

    @Prop({
        type: [String],
        required: true,
        enum: Role,
        default: [Role.User]
    })
    roles: Role[];

    @Prop({
        type: String,
        default: null
    })
    profileImage: string;

    @Prop({
        type: String,
        default: null
    })
    currentHashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User)
    .pre('save', async function (next) {
        try {
            if (!this.isModified('password')) {
                return next();
            }
            const hashed = await bcrypt.hash(this['password'], 10);
            this['password'] = hashed;
            return next();
        } catch (err) {
            return next(err);
        }
    });
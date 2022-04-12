import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose from "mongoose";
import { Document } from 'mongoose';
import { User } from "src/users/schemas/user.schema";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: Number,
    min: 0,
    max: 5,
    default: 0
  })
  rating: number;

  @Prop({
    type: String,
    required: true,
    minlength: 20
  })
  comment: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  @Type(() => User)
  user: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review).set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
});
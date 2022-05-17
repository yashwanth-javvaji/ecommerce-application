// NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Common
import { PaymentStatus } from '@yj-major-project/common';

// Other Dependencies
import mongoose from "mongoose";


export type PaymentDocument = Payment & mongoose.Document;

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
export class Payment {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true
    })
    userId: mongoose.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true
    })
    orderId: mongoose.ObjectId;

    @Prop({
        type: String,
        required: true
    })
    checkoutSession: string;

    @Prop({
        type: String,
        required: true
    })
    paymentIntent: string;

    @Prop({
        type: String,
        required: true,
        enum: PaymentStatus,
        default: PaymentStatus.Unpaid
    })
    status: PaymentStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
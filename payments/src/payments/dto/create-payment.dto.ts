// Other Dependencies
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';


export class CreatePaymentDto {
    @IsNotEmpty()
    @IsMongoId()
    orderId: ObjectId;
}
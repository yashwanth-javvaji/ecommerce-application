// Common
import { PaymentStatus } from '@yj-major-project/common';

// Other Dependencies
import { IsEnum, IsNotEmpty } from 'class-validator';


export class UpdatePaymentDto {
    @IsNotEmpty()
    @IsEnum(PaymentStatus)
    status: PaymentStatus;
}
// Common
import { DeliveryStatus, OrderStatus } from "@yj-major-project/common";

// Other Dependencies
import { IsDate, IsEnum, IsOptional } from "class-validator";


export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;

    @IsOptional()
    @IsEnum(DeliveryStatus)
    deliveryStatus: DeliveryStatus;

    @IsOptional()
    @IsDate()
    deliveredOn: Date;
}

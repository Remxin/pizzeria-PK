import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.IN_PREPARATION,
    description: 'NEW → IN_PREPARATION → READY → PICKED_UP → COMPLETED',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

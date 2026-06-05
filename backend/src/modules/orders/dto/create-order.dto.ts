import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { DeliveryType } from '../../../common/enums/delivery-type.enum';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    enum: DeliveryType,
    example: DeliveryType.DELIVERY,
    description: 'DELIVERY requires deliveryAddress, PICKUP does not',
  })
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @ApiPropertyOptional({
    example: 'ul. Pizzowa 12, 00-001 Warszawa',
    description: 'Required when deliveryType is DELIVERY',
  })
  @ValidateIf((dto: CreateOrderDto) => dto.deliveryType === DeliveryType.DELIVERY)
  @IsString()
  @MaxLength(255)
  deliveryAddress?: string;

  @ApiProperty({ example: '+48123456789' })
  @IsString()
  @MaxLength(20)
  customerPhone: string;

  @ApiPropertyOptional({ example: 'Proszę zadzwonić dzwonkiem' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Order items. No payment required — order is placed immediately.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

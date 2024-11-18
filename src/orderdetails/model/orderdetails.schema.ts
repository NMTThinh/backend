import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })

export class OrderDetails {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order'}) 
  order_id: Types.ObjectId; 

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product'}) 
  product_id: Types.ObjectId; 

  @Prop({ required: true })
  quantity: number; // Số lượng sản phẩm

  @Prop({ required: false })
  note?: string; // Ghi chú cho sản phẩm

  @Prop({ required: true })
  price: number; // Giá sản phẩm
}

export const OrderDetailsSchema = SchemaFactory.createForClass(OrderDetails);

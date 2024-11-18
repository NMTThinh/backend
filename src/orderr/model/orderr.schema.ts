import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true  })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  orderDate: Date;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order', required: false })
  orderparent_id?: Types.ObjectId; 

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'OrderDetails', required: false })
  children?: Types.ObjectId[]; 

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Table', required: false })
  table_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  user_id: Types.ObjectId; 
  
  @Prop({ default: true })
  status: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

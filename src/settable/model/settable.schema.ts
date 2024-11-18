import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })

export class SetTable {
  
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  nameSetTable: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  numberPhone: string;

  @Prop({ required: true })
  reservationDate: string;

  @Prop({ required: true })
  guestCount: number;

  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true })
  notes?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Table'})
  table_id?: Types.ObjectId;
  
}

export const SetTableSchema = SchemaFactory.createForClass(SetTable);

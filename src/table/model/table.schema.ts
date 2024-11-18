import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Table {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  nametable: string;

  @Prop({ required: true })
  numberofchair: number;

  @Prop({ default: true })
  status?: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Table', required: false })
  tableparent_id?: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Table', required: false })
  children?: Types.ObjectId[];
}

export const TableSchema = SchemaFactory.createForClass(Table);

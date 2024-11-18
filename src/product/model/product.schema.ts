import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class Image {
  @Prop({ default: '' })
  image_id: string;

  @Prop({ default: '' })
  image_url: string;
}

@Schema({ versionKey: false })
export class Product {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ min: 0 })
  price: number;

  @Prop({ default: '' })
  image_id?: string;

  @Prop({ default: '' })
  image_url?: string;

  @Prop({ type: [Image], default: [] })
  images?: Image[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category_id?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

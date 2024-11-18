
export class CreateProductDto {
  name: string;

  description?: string;

  price: number;

  status: boolean;

  category_id?: string;
}

//Định nghĩa dữ liệu khi tạo category
export class CreateCategoryDto {
  name: string;
  status: boolean;
  parent_id: string;
}

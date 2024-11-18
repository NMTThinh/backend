import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTableDto } from './dto/create-table.dto'; // Đường dẫn đúng tới CreateTableDto
import { UpdateTableDto } from './dto/update-table.dto'; // DTO để cập nhật bàn ăn
import { Table } from 'src/table/model/table.schema';
import { table } from 'console';

@Injectable()
export class TableRepository {
    constructor(@InjectModel(Table.name) private readonly model: Model<Table>) {}

  // Tạo bàn ăn
  async create(table: CreateTableDto) {
    const newTable = await new this.model({
      _id: new Types.ObjectId(),
      ...table,
    }).save();

    if (newTable.tableparent_id) {
      await this.model.findOneAndUpdate(
        { _id: newTable.tableparent_id },
        { $addToSet: { children: newTable._id } },
        { new: true },
      );
    }

    return newTable;
  }

  // Lấy bàn ăn theo ID
  async findOne(id: string) {
    return await this.model
      .findOne({ _id: id })
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          populate: { path: 'children', populate: { path: 'children' } },
        },
      })
      .lean<Table>(true);
  }

  // Cập nhật bàn ăn
  async updateOne(
    id: string,
    tableOld: Table,
    tableNew: UpdateTableDto,
  ) {
    const updateTable = await this.model.findOneAndUpdate(
      { _id: id },
      tableNew,
      {
        new: true,
      },
    );

    if (tableNew.tableparent_id) {
      await this.model.updateOne(
        { _id: updateTable.tableparent_id },
        { $addToSet: { children: updateTable._id } },
      );
    }

    if (
      tableOld.tableparent_id &&
      tableOld.tableparent_id.toString() !== tableNew.tableparent_id
    ) {
      await this.model.updateOne(
        { _id: tableOld.tableparent_id },
        { $pull: { children: tableOld._id } },
      );
    }

    return updateTable;
  }

  // Xóa bàn ăn
  async deleteTable(id: string) {
    return await this.model.findOneAndDelete({ _id: id });
  }

  // Cập nhật trạng thái bàn ăn
  async updateStatusById(id: string, status: boolean) {
    return await this.model
      .findOneAndUpdate({ _id: id }, { status }, { new: true })
      .lean<Table>(true);
  }
  

}

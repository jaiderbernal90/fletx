import { IPageMetaDtoParameters } from '@/shared/interfaces/api.response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  readonly order: string;

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.order = pageOptionsDto.order;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
  }
}

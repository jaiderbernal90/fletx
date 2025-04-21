import { Controller, Param, ParseIntPipe, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ILocationService, LOCATION_SERVICE_TOKEN } from '../interfaces/location.service.interface';
import { LocationCitiesDecorator, LocationDepartmentsDecorator } from '../decorators/location.decorator';

@Controller('location')
@ApiTags('Location')
export class LocationController {
  constructor(@Inject(LOCATION_SERVICE_TOKEN) private readonly locationSvc: ILocationService) {}

  @LocationCitiesDecorator()
  async getCitiesByDepartmentId(@Param('departmentId', new ParseIntPipe()) departmentId: number) {
    return this.locationSvc.getCitiesByDepartmentId(departmentId);
  }

  @LocationDepartmentsDecorator()
  async getDepartments() {
    return this.locationSvc.getDepartments();
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.templatesService.findAll(category);
  }

  @Get('categories')
  getCategories() {
    return this.templatesService.getCategories();
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.templatesService.findByName(name);
  }
}

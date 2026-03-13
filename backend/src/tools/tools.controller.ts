import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ToolsService } from './tools.service';
import { ToolFactoryService } from '../langchain/tools/tool-factory.service';
import { CreateToolDto, UpdateToolDto } from './dto/create-tool.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Tools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tools')
export class ToolsController {
  constructor(
    private readonly toolsService: ToolsService,
    private readonly toolFactory: ToolFactoryService,
  ) {}

  @Post(':name/test')
  @ApiOperation({ summary: 'Test a tool definition by name' })
  testTool(
    @CurrentUser('id') userId: string,
    @Param('name') name: string,
    @Body() body: { input: Record<string, unknown> },
  ) {
    return this.toolFactory.testTool(name, body.input, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tool definition' })
  create(@Body() dto: CreateToolDto) {
    return this.toolsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tool definitions' })
  findAll(@Query() pagination: PaginationDto) {
    return this.toolsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tool definition by ID' })
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tool definition' })
  update(@Param('id') id: string, @Body() dto: UpdateToolDto) {
    return this.toolsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tool definition' })
  remove(@Param('id') id: string) {
    return this.toolsService.remove(id);
  }
}

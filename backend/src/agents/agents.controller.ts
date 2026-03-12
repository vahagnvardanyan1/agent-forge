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
import { AgentsService } from './agents.service';
import { AgentExecutorService } from './agent-executor.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ExecuteAgentDto } from './dto/execute-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly executorService: AgentExecutorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAgentDto) {
    return this.agentsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user agents' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.agentsService.findAll(userId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an agent' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agent' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.agentsService.remove(id, userId);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute an agent' })
  execute(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ExecuteAgentDto,
  ) {
    return this.executorService.execute(id, userId, dto);
  }
}

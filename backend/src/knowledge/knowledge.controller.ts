import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { QueryKnowledgeDto } from './dto/query-knowledge.dto';

@ApiTags('Knowledge')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  @ApiOperation({ summary: 'Create knowledge base' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateKnowledgeBaseDto,
  ) {
    return this.knowledgeService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List knowledge bases' })
  findAll(@CurrentUser('id') userId: string) {
    return this.knowledgeService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge base detail' })
  findOne(@Param('id') id: string) {
    return this.knowledgeService.findOne(id);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload document to knowledge base' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.knowledgeService.uploadDocument(id, file);
  }

  @Post(':id/query')
  @ApiOperation({ summary: 'Query knowledge base' })
  query(@Param('id') id: string, @Body() dto: QueryKnowledgeDto) {
    return this.knowledgeService.query(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete knowledge base' })
  remove(@Param('id') id: string) {
    return this.knowledgeService.remove(id);
  }
}

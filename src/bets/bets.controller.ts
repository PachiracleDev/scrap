import { ScrapingService } from './services/scraping.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BetsService } from './services/bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { GetBetsDto } from './dto/getBets.dto';
import { OpenAIService } from './services/openai.service';

@Controller('bets')
export class BetsController {
  constructor(
    private readonly betsService: BetsService,
    private readonly scrapingService: ScrapingService,
    private readonly openAIService: OpenAIService,
  ) {}

  @Get()
  findAll(@Body() body: GetBetsDto) {
    const category = body.category;

    return this.scrapingService.findAll(category);
  }
}

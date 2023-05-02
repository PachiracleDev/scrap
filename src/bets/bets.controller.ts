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

const example = [
  {
    oneTeam: 'Real madrid',
    twoTeam: 'Barcelona',
    pages: [
      {
        page: 'Pinnacle',
        winOne: 11.2,
        winTwo: 1.22,
      },
      {
        page: 'Betway',
        winOne: 11.2,
        winTwo: 1.22,
      },
      {
        page: '888starz',
        winOne: 11.2,
        winTwo: 1.22,
      },
    ],
  },
];

@Controller('bets')
export class BetsController {
  constructor(
    private readonly betsService: BetsService,
    private readonly scrapingService: ScrapingService,
    private readonly openAIService: OpenAIService,
  ) {}

  @Get()
  async findAll(@Body() body: GetBetsDto) {
    const category = body.category;

    const allBets = await this.scrapingService.findAll(category);
    console.log(allBets);

    return this.betsService.findCoincidentMatches(allBets);
  }
}

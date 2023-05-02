import { Module } from '@nestjs/common';
import { BetsService } from './services/bets.service';
import { BetsController } from './bets.controller';
import { ScrapingService } from './services/scraping.service';
import { OpenAIService } from './services/openai.service';

@Module({
  controllers: [BetsController],
  providers: [BetsService, ScrapingService, OpenAIService],
})
export class BetsModule {}

import { Injectable } from '@nestjs/common';
import { CreateBetDto } from '../dto/create-bet.dto';
import { UpdateBetDto } from '../dto/update-bet.dto';

@Injectable()
export class BetsService {
  findAll() {
    return `This action returns all bets`;
  }
}

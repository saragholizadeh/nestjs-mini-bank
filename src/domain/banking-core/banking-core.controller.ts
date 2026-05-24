import { Controller } from '@nestjs/common';
import { BankingCoreService } from './banking-core.service';

@Controller('banking-core')
export class BankingCoreController {
  constructor(private readonly bankingCoreService: BankingCoreService) {}
}

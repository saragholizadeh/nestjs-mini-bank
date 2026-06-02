import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { DepositService } from './deposit.service';
import { DepositDto } from '../dto/transaction.dto';
import {
  ApiDepositDocs,
  ApiTransactionControllerDocs,
} from '../transaction.swagger';

@ApiTransactionControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('deposit')
  @ApiDepositDocs()
  deposit(@CurrentUser() user: User, @Body() dto: DepositDto) {
    return this.depositService.deposit(user, dto);
  }
}

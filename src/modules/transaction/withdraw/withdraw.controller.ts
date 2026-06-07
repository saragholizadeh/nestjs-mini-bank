import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { WithdrawService } from './withdraw.service';
import { WithdrawDto } from '../dto/transaction.dto';
import {
  ApiTransactionControllerDocs,
  ApiWithdrawDocs,
} from '../transaction.swagger';
import { IpAddress } from 'src/common/decorators/ip-address.decorator';

@ApiTransactionControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post('withdraw')
  @ApiWithdrawDocs()
  withdraw(
    @CurrentUser() user: User,
    @Body() dto: WithdrawDto,
    @IpAddress() ip: string | null,
  ) {
    return this.withdrawService.withdraw(user, dto, ip);
  }
}

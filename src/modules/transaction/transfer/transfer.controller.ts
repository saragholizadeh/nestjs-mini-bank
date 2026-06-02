import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { TransferService } from './transfer.service';
import { TransferDto } from '../dto/transaction.dto';
import {
  ApiTransactionControllerDocs,
  ApiTransferDocs,
} from '../transaction.swagger';

@ApiTransactionControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('transfer')
  @ApiTransferDocs()
  transfer(@CurrentUser() user: User, @Body() dto: TransferDto) {
    return this.transferService.transfer(user, dto);
  }
}

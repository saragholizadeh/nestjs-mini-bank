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
import { IpAddress } from 'src/common/decorators/ip-address.decorator';

@ApiTransactionControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('transfer')
  @ApiTransferDocs()
  transfer(
    @CurrentUser() user: User,
    @Body() dto: TransferDto,
    @IpAddress() ip: string | null,
  ) {
    return this.transferService.transfer(user, dto, ip);
  }
}

import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/infrastructure/database/entities/user.entity';
import { TransactionHistoryQueryDto } from './dto/transaction.dto';
import { TransactionQueryService } from './transaction-query.service';
import {
  ApiTransactionControllerDocs,
  ApiTransactionHistoryDocs,
  ApiTransactionReceiptDocs,
} from './transaction.swagger';

@ApiTransactionControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionQueryService: TransactionQueryService,
  ) {}

  @Get('history')
  @ApiTransactionHistoryDocs()
  getMyHistory(
    @CurrentUser() user: User,
    @Query() query: TransactionHistoryQueryDto,
  ) {
    return this.transactionQueryService.getMyHistory(user.id, query);
  }

  @Get(':transactionId/receipt')
  @ApiTransactionReceiptDocs()
  getMyReceipt(
    @CurrentUser() user: User,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ) {
    return this.transactionQueryService.getMyReceipt(user.id, transactionId);
  }
}

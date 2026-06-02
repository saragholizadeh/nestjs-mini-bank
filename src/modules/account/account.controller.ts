import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  ApiAccountBalanceDocs,
  ApiAccountControllerDocs,
  ApiMyAccountsDocs,
} from './account.swagger';

@ApiAccountControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('my')
  @ApiMyAccountsDocs()
  getMyAccounts(@CurrentUser() user: User) {
    return this.accountService.getMyAccounts(user.id);
  }

  @Get(':accountId/balance')
  @ApiAccountBalanceDocs()
  getMyAccountBalance(
    @CurrentUser() user: User,
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ) {
    return this.accountService.getMyAccountBalance(user.id, accountId);
  }
}

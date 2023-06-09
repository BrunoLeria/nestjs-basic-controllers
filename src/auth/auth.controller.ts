import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { UserType } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import JwtAuthGuard from './guards/jwt-auth.guard';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @CurrentUser() user: UserType,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout(response);
    response.send();
  }
}

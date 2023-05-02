import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserType } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async login(user: UserType, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email: email });
      await this.validatePassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async validatePassword(password: string, hashedPassword: string) {
    const passwordIsValid = await bcrypt.compare(password, hashedPassword);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
}

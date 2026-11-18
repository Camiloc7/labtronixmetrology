import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Labtronix Metrology API';
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'labtronix-backend',
      timestamp: new Date().toISOString(),
    };
  }
}

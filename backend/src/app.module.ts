import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { QuotesModule } from './quotes/quotes.module';
import { EquipmentModule } from './equipment/equipment.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { EmailRequestsModule } from './email-requests/email-requests.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { ExcelModule } from './common/excel/excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        database: config.get('DATABASE_NAME', 'labtronix_db'),
        username: config.get('DATABASE_USER', 'labtronix_user'),
        password: config.get('DATABASE_PASSWORD', ''),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    QuotesModule,
    EquipmentModule,
    WorkOrdersModule,
    EmailRequestsModule,
    ActivityLogsModule,
    ExcelModule,
  ],
})
export class AppModule {}

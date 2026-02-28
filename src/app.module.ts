import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CustomerModule } from './customer/customer.module';
import { FilmModule } from './film/film.module';
import { RentalModule } from './rental/rental.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get('DB_HOST', 'localhost'),
        port:     config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'sakila'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    ScheduleModule.forRoot(),
    CustomerModule,
    FilmModule,
    RentalModule,
    SchedulerModule,
  ],
})
export class AppModule {}
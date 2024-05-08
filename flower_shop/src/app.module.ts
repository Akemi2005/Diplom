import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DatabaseModule } from './database.module';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'nastyasemeniuk1225@gmail.com',
          pass: 'wnjveshdhdzkvbwd',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"Flower Subscription" <nastyasemeniuk1225@gmail.com>',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order]),
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

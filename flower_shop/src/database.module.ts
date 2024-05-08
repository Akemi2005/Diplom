import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';

@Module({
    imports: [
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
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}

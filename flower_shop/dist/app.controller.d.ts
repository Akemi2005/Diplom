import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
export declare class AppController {
    private orderRepository;
    private readonly mailerService;
    constructor(orderRepository: Repository<Order>, mailerService: MailerService);
    submitPhoneNumber(phoneNumber: string, res: Response): Promise<void>;
    checkout(plan: string, frequency: string, deliveries: number, email: string, res: Response): Promise<void>;
    submitOrder(orderData: Order, res: Response): Promise<void>;
}

import { Post, Body, Res, Controller } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Controller()
export class AppController {
  constructor(
      @InjectRepository(Order)
      private orderRepository: Repository<Order>,
      private readonly mailerService: MailerService
  ) {}

@Post('/submitPhoneNumber')
  async submitPhoneNumber(@Body('phone') phoneNumber: string, @Res() res: Response) {
    try {
      await this.mailerService.sendMail({
        to: 'nastyasemeniuk1225@gmail.com',
        subject: 'New Phone Number Submission',
        text: `New phone number submitted: ${phoneNumber}`,
      });
      console.log('Email sent successfully');
      res.json({ success: true, message: 'Phone number submitted successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  @Post('/checkout')
  async checkout(
      @Body('plan') plan: string,
      @Body('frequency') frequency: string,
      @Body('deliveries') deliveries: number,
      @Body('email') email: string,
      @Res() res: Response,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email, // Використано значення email з тіла запиту
        subject: 'New Subscription Order',
        text: `Plan: ${plan}\nFrequency: ${frequency}\nNumber of deliveries: ${deliveries} \nThank you for ordering Kyiv Luxe Bouquets! \nOur manager will write to you to clarify the details`,
      });
      console.log('Email sent successfully');
      res.json({ success: true, message: 'Subscription order submitted successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }


  @Post('/submitOrder')
  async submitOrder(
      @Body() orderData: Order,
      @Res() res: Response,
  ) {
    try {
      // Зберігання даних в базі даних
      const newOrder = this.orderRepository.create(orderData);
      await this.orderRepository.save(newOrder);

      // Відправлення листа на електронну пошту
      const cartItems = JSON.parse(orderData.cartItems);
      const cartItemsSummary = cartItems.map(item => `${item.name} - Quantity: ${item.quantity}, Price: $${item.totalPrice}`).join('\n');

      await this.mailerService.sendMail({
        to: orderData.email,
        subject: 'Order Summary',
        text: `Thank you for your order!\n\nOrder Summary:\n${cartItemsSummary}\n\nSubtotal: $${orderData.subtotal.toFixed(2)}\nShipping: $${orderData.shipping.toFixed(2)}\nTotal: $${orderData.total.toFixed(2)}\n\nCustomer Name: ${orderData.name}\nCustomer Email: ${orderData.email}\nCustomer Phone: ${orderData.phone}\n\nRecipient Name: ${orderData.recipientName}\nRecipient Phone: ${orderData.recipientPhone}\nDelivery Date: ${orderData.deliveryDate}\nDelivery Time: ${orderData.deliveryTime}\n\nAddress: ${orderData.street}, Apartment: ${orderData.apartment}`,
      });

      // Відповідь про успішне виконання запиту
      res.json({ success: true, message: 'Order submitted successfully' });
    } catch (error) {
      console.error('Error submitting order:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

}

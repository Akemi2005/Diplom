"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
let AppController = class AppController {
    constructor(orderRepository, mailerService) {
        this.orderRepository = orderRepository;
        this.mailerService = mailerService;
    }
    async submitPhoneNumber(phoneNumber, res) {
        try {
            await this.mailerService.sendMail({
                to: 'nastyasemeniuk1225@gmail.com',
                subject: 'New Phone Number Submission',
                text: `New phone number submitted: ${phoneNumber}`,
            });
            console.log('Email sent successfully');
            res.json({ success: true, message: 'Phone number submitted successfully' });
        }
        catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    async checkout(plan, frequency, deliveries, email, res) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'New Subscription Order',
                text: `Plan: ${plan}\nFrequency: ${frequency}\nNumber of deliveries: ${deliveries} \nThank you for ordering Kyiv Luxe Bouquets! \nOur manager will write to you to clarify the details`,
            });
            console.log('Email sent successfully');
            res.json({ success: true, message: 'Subscription order submitted successfully' });
        }
        catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    async submitOrder(orderData, res) {
        try {
            const newOrder = this.orderRepository.create(orderData);
            await this.orderRepository.save(newOrder);
            const cartItems = JSON.parse(orderData.cartItems);
            const cartItemsSummary = cartItems.map(item => `${item.name} - Quantity: ${item.quantity}, Price: $${item.totalPrice}`).join('\n');
            await this.mailerService.sendMail({
                to: orderData.email,
                subject: 'Order Summary',
                text: `Thank you for your order!\n\nOrder Summary:\n${cartItemsSummary}\n\nSubtotal: $${orderData.subtotal.toFixed(2)}\nShipping: $${orderData.shipping.toFixed(2)}\nTotal: $${orderData.total.toFixed(2)}\n\nCustomer Name: ${orderData.name}\nCustomer Email: ${orderData.email}\nCustomer Phone: ${orderData.phone}\n\nRecipient Name: ${orderData.recipientName}\nRecipient Phone: ${orderData.recipientPhone}\nDelivery Date: ${orderData.deliveryDate}\nDelivery Time: ${orderData.deliveryTime}\n\nAddress: ${orderData.street}, Apartment: ${orderData.apartment}`,
            });
            res.json({ success: true, message: 'Order submitted successfully' });
        }
        catch (error) {
            console.error('Error submitting order:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('/submitPhoneNumber'),
    __param(0, (0, common_1.Body)('phone')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "submitPhoneNumber", null);
__decorate([
    (0, common_1.Post)('/checkout'),
    __param(0, (0, common_1.Body)('plan')),
    __param(1, (0, common_1.Body)('frequency')),
    __param(2, (0, common_1.Body)('deliveries')),
    __param(3, (0, common_1.Body)('email')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "checkout", null);
__decorate([
    (0, common_1.Post)('/submitOrder'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_entity_1.Order, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "submitOrder", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_1.MailerService])
], AppController);
//# sourceMappingURL=app.controller.js.map
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    recipientName: string;

    @Column()
    recipientPhone: string;

    @Column()
    deliveryDate: string;

    @Column()
    deliveryTime: string;

    @Column()
    street: string;

    @Column()
    apartment: string;

    @Column({ type: 'text' })
    cartItems: string;

    @Column()
    subtotal: number;

    @Column()
    shipping: number;

    @Column()
    total: number;
}

import { Logger } from '@nestjs/common';
import { RefundDto } from 'src/common/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  getManager,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import RefundTransactions from './transaction.entity';

@Entity({ name: 'order_refunds' })
export default class Refund extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  transactionUrl: string;

  @Column()
  platform: string;

  @Column()
  currentOrderStatus: string;

  @Column()
  currency: string;

  @Column('decimal', { precision: 8, scale: 2 })
  totalRefundedAmount: number;

  @Column('decimal', { precision: 8, scale: 2 })
  currentTotalAmount: number;

  @Column('decimal', { precision: 8, scale: 2 })
  currentNetPayment: number;

  @Column()
  orderId: string;

  @OneToMany(() => RefundTransactions, (transaction) => transaction.refund)
  @JoinColumn()
  transactions?: RefundTransactions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public static async makeRefund(refundData: RefundDto): Promise<Refund> {
    const transactionsDto = refundData.transactions;
    delete refundData.transactions;
    Logger.log({ message: 'Checking for previous refunds', refundData });
    const repo = getManager().getRepository(Refund);
    const refunds = await repo.find({
      where: {
        transactionUrl: refundData.transactionUrl,
      },
    });
    let result: Refund;
    if (refunds.length < 1) {
      Logger.log({ message: 'Inserting refund', refundData });
      result = repo.create({
        ...refundData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await repo.save(result);
    } else {
      const refund = refunds[0];
      result = repo.merge(refund, {
        ...refundData,
        updatedAt: new Date(),
      });
      Logger.log({ message: 'Updating refund', result });
      const updateResult = await repo
        .createQueryBuilder()
        .update(result)
        .where('transaction_url = :url', { url: refundData.transactionUrl })
        .execute();
      if (updateResult.affected !== 1) {
        throw new Error(`${updateResult.affected} rows on refund update`);
      }
    }
    let transactions: RefundTransactions[] = [];
    if (transactionsDto && transactionsDto.length > 0) {
      transactions = await RefundTransactions.saveRefundTransactions(
        transactionsDto,
        result.id,
      );
    }
    result.transactions = transactions;
    return result;
  }
}

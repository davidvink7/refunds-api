import { RefundTransactionDto } from 'src/common/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  getRepository,
} from 'typeorm';
import Refund from './refund.entity';

@Entity({ name: 'order_refund_transactions' })
export default class RefundTransactions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 8, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  authorizationId: string;

  @Column()
  reason: string;

  @Column()
  processedAt: Date;

  @ManyToOne(() => Refund, (refund) => refund.id)
  @JoinColumn({ name: 'order_refund_id', referencedColumnName: 'id' })
  refund: Refund;

  @Column()
  orderRefundId: number;

  @Column()
  provider?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public static async saveRefundTransactions(
    dtos: RefundTransactionDto[],
    refundId: number,
  ): Promise<RefundTransactions[]> {
    const repo = getRepository(RefundTransactions);
    const transactions = RefundTransactions.convertToEntity(dtos, refundId);
    await repo.save(transactions);
    return transactions;
  }

  private static validateTransactionEntity(dto: RefundTransactionDto) {
    if (dto.amount === undefined || dto.amount === null) {
      throw new Error('Transaction needs to have a specified amount.');
    }
    return;
  }

  public static createTransactionsEntity(
    dto: RefundTransactionDto,
    refundId: number,
  ): RefundTransactions {
    const trn = { ...dto, orderRefundId: refundId };
    RefundTransactions.validateTransactionEntity(trn);
    return getRepository(RefundTransactions).create({
      ...trn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static convertToEntity(
    transactionsDto: RefundTransactionDto[],
    refundId: number,
  ): RefundTransactions[] {
    return transactionsDto.reduce((acc, trn) => {
      const trnEntity = RefundTransactions.createTransactionsEntity(
        trn,
        refundId,
      );
      acc.push(trnEntity);
      return acc;
    }, [] as RefundTransactions[]);
  }
}

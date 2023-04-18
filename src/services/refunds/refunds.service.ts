import { Injectable, Logger } from '@nestjs/common';
import { RefundDto } from 'src/common/types';
import RefundEntity from 'src/entities/refund.entity';

@Injectable()
export class RefundsService {
  public async createOrUpdateRefund(refundData: RefundDto): Promise<any> {
    try {
      if (!refundData.transactionUrl) {
        throw new Error('No transactionUrl provided rows on refund update');
      }
      return RefundEntity.makeRefund(refundData);
    } catch (err) {
      Logger.error({ message: 'Error inserting refund' }, err);
      throw err;
    }
  }
}

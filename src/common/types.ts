export type RefundDto = {
  transactionUrl: string;
  platform: string;
  currentOrderStatus: string;
  totalRefundedAmount: number;
  currentTotalAmount: number;
  currentNetPayment: number;
  currency: string;
  orderId: string;
  transactions: RefundTransactionDto[];
};

export type RefundTransactionDto = {
  amount: number;
  currency: string;
  authorizationId?: string;
  provider?: string;
  reason: string;
  processedAt: Date;
};

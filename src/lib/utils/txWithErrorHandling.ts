import { ErrorCode } from '@ethersproject/logger'
import { ethers } from 'ethers'

export enum WrappedTransactionReceiptState {
  SUCCESS,
  ERROR,
  CANCELLED,
  SPEDUP
}

export type WrappedTransactionReceipt = {
  status: WrappedTransactionReceiptState
  receipt: ethers.providers.TransactionReceipt
  data: any
}

export default function txWithErrorHandling(
  tx: ethers.providers.TransactionResponse,
  confirmations = 1
): Promise<WrappedTransactionReceipt> {
  return tx
    .wait(confirmations)
    .then((response) => ({
      status: WrappedTransactionReceiptState.SUCCESS,
      receipt: response,
      data: response
    }))
    .catch(
      (error: {
        code: ErrorCode
        cancelled: boolean
        receipt: ethers.providers.TransactionReceipt
      }) => {
        if (error.code === ErrorCode.TRANSACTION_REPLACED) {
          if (error.cancelled) {
            console.log('Transaction was cancelled', error)
            return {
              status: WrappedTransactionReceiptState.CANCELLED,
              receipt: error.receipt,
              data: error
            }
          } else {
            console.log('Transaction was replaced', error)
            return {
              status: WrappedTransactionReceiptState.SPEDUP,
              receipt: error.receipt,
              data: error
            }
          }
        }
        return { status: WrappedTransactionReceiptState.ERROR, receipt: error.receipt, data: error }
      }
    )
}

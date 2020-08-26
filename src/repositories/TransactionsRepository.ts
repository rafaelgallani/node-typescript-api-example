import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface TransactionDTO {
  title: string;
  value: number;
  type: Transaction['type'];
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private getTransactionsByType(type: Transaction['type']): Transaction[] {
    return this.transactions.filter(transaction => transaction.type === type);
  }

  public getBalance(): Balance {
    const sumTransactions = (transactions: Transaction[]): number =>
      transactions.reduce((a, { value }) => a + value, 0);

    const incomeTransactionsSum = sumTransactions(
      this.getTransactionsByType('income'),
    );
    const outcomeTransactionsSum = sumTransactions(
      this.getTransactionsByType('outcome'),
    );

    return {
      income: incomeTransactionsSum,
      outcome: outcomeTransactionsSum,
      total: incomeTransactionsSum - outcomeTransactionsSum,
    };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    if (transaction.type === 'outcome') {
      const { total } = this.getBalance();
      if (transaction.value > total)
        throw new Error(
          'The transaction limit cannot exceed the total balance.',
        );
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;

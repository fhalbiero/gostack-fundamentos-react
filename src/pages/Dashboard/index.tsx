import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';
 
import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';



interface Transaction {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}


interface FormattedTransaction {
  id: string;
  title: string;
  formattedValue: string;
  formattedDate: Date;
  type: 'income' | 'outcome';
  category: { title: string };
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
   const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
   const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {

      api.get('/transactions').then(response => {
        const formattedTransactions = response.data.transactions.map( (transaction: Transaction) => {
          const { id, title, value, created_at, type, category } = transaction;
          const formattedTransaction: FormattedTransaction = {
              id,
              title,
              type,
              category,
              formattedValue: formatValue(value),
              formattedDate: created_at
          }
          console.log(formattedTransaction);
          return formattedTransaction;
        })

        setTransactions(formattedTransactions);
        setBalance(response.data.balance);
      });

    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formatValue(balance.outcome)}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              { transactions.map( transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className="income">{transaction.formattedValue}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
              )) }
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;

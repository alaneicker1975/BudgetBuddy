import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAppContext } from '../../AppProvider';
import ExpenseGroupLayout from '../../components/ExpenseGroupLayout';
import {
  getSubTotalFromCollection,
  getUnpaidBalanceFromCollection,
  getLeftOverBalance,
  formatNumber,
} from '../../utilities/numbers';
import useExpenseGroup from './useExpenseGroup';

const ExpenseGroup = () => {
  const { budgetLimitPercentage } = useAppContext();
  const { id } = useParams();
  const { data } = useExpenseGroup();

  if (data) {
    const group = data.expenseGroup;

    const subtotal = getSubTotalFromCollection(group.expenses, 'balance');

    const totalBalance = `$${formatNumber(subtotal)}`;

    const totalBudgetAmount = `$${formatNumber(group.totalBudget)}`;

    const unpaidBalance = `$${formatNumber(
      getUnpaidBalanceFromCollection(group.expenses, 'balance'),
    )}`;

    const leftOverBalance = `$${formatNumber(
      getLeftOverBalance(group.totalBudget, subtotal),
    )}`;

    const expenseRatio = Math.round((subtotal / group.totalBudget) * 100);

    const isOverBudget = group.totalBudget - subtotal < 0;

    const isAlmostOverBudget = expenseRatio > budgetLimitPercentage;

    const overdueExpenses = group.expenses.filter(
      (expense) =>
        expense.dueDate &&
        new Date(expense.dueDate) < new Date() &&
        !expense.paid,
    ).length;

    const props = {
      id,
      totalBalance,
      totalBudgetAmount,
      unpaidBalance,
      leftOverBalance,
      isOverBudget,
      isAlmostOverBudget,
      overdueExpenses,
      budgetLimitPercentage,
      ...group,
    };

    return <ExpenseGroupLayout {...props} />;
  }

  return null;
};

export default ExpenseGroup;

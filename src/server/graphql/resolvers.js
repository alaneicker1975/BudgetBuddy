const expenseGroups = [
  {
    id: 1,
    title: 'March 1, 2022 - March 15, 2022',
    totalBudget: 5600,
    expenses: [
      {
        id: 1,
        name: 'Mortgage',
        balance: 2319.78,
        dueDate: '2/1/2022',
        isPaid: 0,
        notes: 'First mortgage payment!',
      },
      {
        id: 2,
        name: 'Credit Card',
        balance: 100,
        dueDate: '2/11/2022',
        isPaid: 1,
      },
      {
        id: 3,
        name: 'Groceries',
        balance: 400,
        isPaid: 1,
      },
      {
        id: 4,
        name: 'Gas',
        balance: 150,
        isPaid: 0,
      },
      {
        id: 5,
        name: 'College Funds',
        balance: 600,
        isPaid: 0,
      },
      {
        id: 6,
        name: 'Roth IRA',
        balance: 250,
        isPaid: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'March 16, 2022 - March 31, 2022',
    totalBudget: 5450,
    expenses: [
      {
        id: 1,
        name: 'Car Payment',
        balance: 359.48,
        dueDate: '3/1/2022',
        isPaid: 0,
        notes: 'First mortgage payment!',
      },
      {
        id: 2,
        name: 'ComEd',
        balance: 119.89,
        dueDate: '3/15/2022',
        isPaid: 0,
      },
    ],
  },
];

module.exports = {
  expenseGroups: () => expenseGroups,
  expenseGroup: ({ id }) => {
    console.log(expenseGroups.find((group) => group.id === id));
    return expenseGroups.find((group) => group.id === id);
  },
};

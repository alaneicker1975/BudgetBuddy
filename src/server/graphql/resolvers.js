const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ExpenseGroup = require('../mongoose/expenseGroupSchema');
const User = require('../mongoose/userSchema');

module.exports = {
  verifyToken: (args, context) => {
    const {
      cookies: { token },
    } = context.req;

    console.log(token);

    // jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    //   const err = error || decoded === undefined;
    //   res.send({ err });
    // });

    return { isValid: true };
  },
  authenticateUser: async ({ input }, context) => {
    try {
      const { username, password } = input;
      const user = await User.findOne({ username });
      const loggedIn = bcrypt.compareSync(password, user.password);

      if (!loggedIn) {
        return { error: 'Invalid login' };
      }

      const token = jwt.sign({}, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      context.res.cookie('token', token, { httpOnly: true });

      return { loggedIn };
    } catch (err) {
      return { error: err.message };
    }
  },
  expenseGroups: async () => {
    try {
      return await ExpenseGroup.find({});
    } catch (err) {
      return { error: err.message };
    }
  },
  expenseGroup: async ({ _id }) => {
    try {
      return await ExpenseGroup.findById({ _id });
    } catch (err) {
      return { error: err.message };
    }
  },
  updateExpenseGroup: async ({ input }) => {
    try {
      await ExpenseGroup.findOneAndReplace({ _id: input._id }, input, {
        returnNewDocument: false,
      });
      return input;
    } catch (err) {
      return { error: err.message };
    }
  },
  createExpenseGroup: async ({ input }) => {
    try {
      const newExpenseGroup = new ExpenseGroup(input);
      newExpenseGroup.save();
      return newExpenseGroup;
    } catch (err) {
      return { error: err.message };
    }
  },
  deleteExpenseGroup: async ({ groupId }) => {
    try {
      await ExpenseGroup.deleteOne({ _id: groupId });
      return { groupId };
    } catch (err) {
      return { error: err.message };
    }
  },
  updatePaidStatus: async ({ groupId, expenseId, paid }) => {
    try {
      const expenseGroup = await ExpenseGroup.findById({ _id: groupId });
      const expense = expenseGroup.expenses.id(expenseId);

      expense.set({ ...expense, paid });

      expenseGroup.save();

      return {
        groupId,
        expenseId,
        paid,
      };
    } catch (err) {
      return { error: err.message };
    }
  },
  deleteExpense: async ({ groupId, expenseId }) => {
    try {
      const expenseGroup = await ExpenseGroup.findById({ _id: groupId });
      const expense = expenseGroup.expenses.id(expenseId);

      expense.remove();

      expenseGroup.save();

      return { groupId, expenseId };
    } catch (err) {
      return { error: err.message };
    }
  },
};

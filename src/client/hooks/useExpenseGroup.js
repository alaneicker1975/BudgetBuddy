import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useAppContext } from '../providers/AppProvider';
import { GET_EXPENSE_GROUP } from '../queries';
import { DELETE_EXPENSE_GROUP } from '../mutations';

const useExpenseGroup = () => {
  const history = useHistory();
  const { id } = useParams();
  const { setShowLoader, setAlert } = useAppContext();

  const expenseGroupRequest = useQuery(GET_EXPENSE_GROUP, {
    skip: !id,
    variables: {
      id,
    },
    onError: (err) => setAlert({ type: 'error', message: err.message }),
  });

  const [deleteExpenseGroup, deleteExpenseGroupRequest] = useMutation(
    DELETE_EXPENSE_GROUP,
    {
      onError: (err) => setAlert({ type: 'error', message: err.message }),
      onCompleted: () => history.push('/expense-groups'),
      update: (cache, { data }) => {
        const { response } = data;

        cache.evict({
          id: cache.identify({
            id: response.groupId,
            __typename: 'ExpenseGroup',
          }),
        });
      },
    },
  );

  const onDeleteExpenseGroup = (groupId) => {
    deleteExpenseGroup({ variables: { groupId } });
  };

  useEffect(() => {
    setShowLoader(
      expenseGroupRequest.loading || deleteExpenseGroupRequest.loading,
    );
  }, [expenseGroupRequest, deleteExpenseGroupRequest, setShowLoader]);

  return { data: expenseGroupRequest.data, onDeleteExpenseGroup };
};

export default useExpenseGroup;
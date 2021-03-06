import React, { useContext, createContext, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useRouteGuard from '../hooks/useRouteGuard';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { verifyToken } = useRouteGuard({
    routeMatchers: /expense-groups/,
    onErrorRedirect: '/',
  });

  const [showLoader, setShowLoader] = useState(false);
  const [alert, setAlert] = useState();

  const budgetLimitPercentage = 80;

  useEffect(() => {
    verifyToken();
    setAlert();
    history.listen(() => {
      document.querySelector('#layout-body').scrollTop = 0;
    });
  }, [history, pathname, verifyToken]);

  return (
    <AppContext.Provider
      value={{
        alert,
        setAlert,
        showLoader,
        setShowLoader,
        budgetLimitPercentage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;

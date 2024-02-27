import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';

import {
  getIsAuthenticatedFromAuth,
  setIsAuthenticated,
  logoutAction,
  getUserDetailsFromAuth
} from '../redux/slices/authSlice';
import { useSelector, useDispatch } from '../redux/store';
import { MIconButton } from '../components/@material-extend';

const useAuth = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isAuthenticated = useSelector(getIsAuthenticatedFromAuth);
  const user = useSelector(getUserDetailsFromAuth);
  console.log('🚀 => user', user);
  const dispatch = useDispatch();

  const isValidToken = (accessToken) => {
    if (!accessToken) {
      return false;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          dispatch(setIsAuthenticated(isValidToken(accessToken)));
        } else {
          enqueueSnackbar('Session expired! Login again', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          dispatch(setIsAuthenticated(isValidToken(accessToken)));
          dispatch(logoutAction());
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Something went wrong! Login again', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        dispatch(logoutAction());
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isAuthenticated };
};

export default useAuth;

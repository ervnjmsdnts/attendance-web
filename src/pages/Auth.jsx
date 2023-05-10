import { Box } from '@mui/material';
import { useState } from 'react';
import Login from '../containers/Auth/Login';
import SignUp from '../containers/Auth/SignUp';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const showSignUpForm = () => setIsLogin(false);
  const showLoginForm = () => setIsLogin(true);

  return (
    <Box sx={{ height: '100vh', bgcolor: '#F2F2F9' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box>
          {isLogin ? (
            <Login showSignUpForm={showSignUpForm} />
          ) : (
            <SignUp showLoginForm={showLoginForm} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;

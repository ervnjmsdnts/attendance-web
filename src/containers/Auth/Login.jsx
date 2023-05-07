import { Box, Button, Link, Stack, Typography } from '@mui/material';
import Input from '../../components/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCustomMutation from '../../utils/useCustomMutation';
import { toast } from 'react-toastify';
import { login } from '../../actions';
import LoginImage from '../../assets/login.png';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .nonempty({ message: 'Field is required' })
    .min(6, { message: 'Password must be atleast 6 characters' }),
});

const Login = ({ showSignUpForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = useCustomMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem('profile', JSON.stringify(data));

      if (data.role === 'PRINCIPAL') {
        window.location.href = '/admin';
      } else {
        toast.error('You are not authorized.');
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const onSubmit = async (data) => {
    await loginMutation.execute({ ...data });
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <Stack
        gap="8px"
        sx={{
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          bgcolor: 'white',
          p: 2,
          justifyContent: 'center',
        }}
        width="100%"
      >
        <Typography fontWeight="bold" mb="16px" variant="h4">
          Login
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="16px"
        >
          <Input label="Email" errors={errors.email} {...register('email')} />
          <Input
            label="Password"
            type="password"
            errors={errors.password}
            {...register('password')}
          />
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={loginMutation.isLoading}
            fullWidth
            size="large"
          >
            Login
          </Button>
        </Box>
        <Typography>
          Don&apos;t have an account?{' '}
          <Link onClick={showSignUpForm} sx={{ cursor: 'pointer' }}>
            Sign up
          </Link>
        </Typography>
      </Stack>
      <Stack
        gap={2}
        sx={{
          bgcolor: '#101828',
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          p: 8,
        }}
      >
        <Typography color="white" variant="h5" sx={{ textAlign: 'center' }}>
          Student Attendance System
        </Typography>
        <Box component="img" src={LoginImage} width="100%" />
        <Typography color="white" textAlign="center">
          EST 2022
        </Typography>
      </Stack>
    </Box>
  );
};

export default Login;

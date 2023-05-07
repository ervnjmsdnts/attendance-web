import { Avatar, Box, Button, Link, Stack, Typography } from '@mui/material';
import Input from '../../components/Input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCustomMutation from '../../utils/useCustomMutation';
import { toast } from 'react-toastify';
import { signup } from '../../actions';

const signUpSchema = z.object({
  schoolName: z.string().nonempty({ message: 'Field is required' }),
  email: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .nonempty({ message: 'Field is required' })
    .min(6, { message: 'Password must be atleast 6 characters' }),
});

const SignUp = ({ showLoginForm }) => {
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const signUpMutation = useCustomMutation(signup, {
    onSuccess: () => {
      toast.success('Successful sign up');
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    await signUpMutation.execute({ ...data, file });
  };

  return (
    <Stack gap="8px" bgcolor="white" p={2} borderRadius={2} width="700px">
      <Typography fontWeight="bold" mb="16px" variant="h4">
        Sign up
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="16px"
      >
        {file && (
          <Avatar
            sx={{ width: 150, height: 150 }}
            src={URL.createObjectURL(file)}
          />
        )}
        <Button variant="contained" color="info" component="label">
          Upload School Logo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <Input
          label="School Name"
          errors={errors.schoolName}
          {...register('schoolName')}
        />
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
          fullWidth
          size="large"
          disabled={signUpMutation.isLoading}
        >
          Create Account
        </Button>
      </Box>
      <Typography>
        Already have an account?{' '}
        <Link onClick={showLoginForm} sx={{ cursor: 'pointer' }}>
          Log in
        </Link>
      </Typography>
    </Stack>
  );
};

export default SignUp;

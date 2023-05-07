import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Input from '../components/Input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCustomMutation from '../utils/useCustomMutation';
import { addTeacher } from '../actions';
import { toast } from 'react-toastify';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const addTeacherSchema = z.object({
  firstName: z.string().nonempty({ message: 'Field is required' }),
  lastName: z.string().nonempty({ message: 'Field is required' }),
  email: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .nonempty({ message: 'Field is required' })
    .min(6, { message: 'Password must be atleast 6 characters' }),
});

const AddTeacherModal = ({ onClose, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addTeacherSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const addTeacherMutation = useCustomMutation(addTeacher, {
    onSuccess: () => {
      toast.success('Successfully added teacher');
      onClose();
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const onSubmit = async (data) => {
    await addTeacherMutation.execute({ ...data, school: user.schoolName });
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Teacher</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Stack sx={{ gap: 1.5, pt: 1 }}>
          <Stack direction="row" gap={1}>
            <Input
              size="small"
              errors={errors.firstName}
              label="First Name"
              {...register('firstName')}
            />
            <Input
              size="small"
              errors={errors.lastName}
              label="Last Name"
              {...register('lastName')}
            />
          </Stack>
          <Input
            size="small"
            label="Email"
            errors={errors.email}
            {...register('email')}
          />
          <Input
            size="small"
            label="Password"
            type="password"
            errors={errors.password}
            {...register('password')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const Teachers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState([]);

  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setRows(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (doc) => doc.role === 'TEACHER' && doc.school === user.schoolName
          )
      );
    });

    return () => {
      unsub();
    };
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, headerClassName: 'header' },
    { field: 'email', headerName: 'Email', flex: 1, headerClassName: 'header' },
  ];

  return (
    <>
      <AddTeacherModal open={openModal} onClose={() => setOpenModal(false)} />
      <Box>
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Add Teacher
          </Button>
        </Box>
        <Box
          sx={{
            '.header': {
              bgcolor: '#b0bfe9',
            },
          }}
        >
          <DataGrid
            sx={{ bgcolor: 'white', border: 'none' }}
            columns={columns}
            rows={rows}
            hideFooter
            autoHeight
          />
        </Box>
      </Box>
    </>
  );
};

export default Teachers;

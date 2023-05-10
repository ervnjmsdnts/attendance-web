import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import moment from 'moment';

const InfoBox = ({ name, count }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        bgcolor: '#b0bfe9',
        borderRadius: 2,
        color: 'white',
        py: '16px',
      }}
    >
      <Typography variant="h5">{count}</Typography>
      <Typography variant="h6">{name}</Typography>
    </Box>
  );
};

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [students, setStudents] = useState([]);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState(true);

  const getFullName = (params) => {
    return `${params.row.firstName} ${params.row.middleName} ${params.row.lastName}`;
  };

  const getTime = (params) => {
    const createdAt = params.row.createdAt;
    const timestamp = moment
      .unix(createdAt.seconds)
      .milliseconds(createdAt.nanoseconds / 1000000);
    return `${timestamp.format('MMMM DD, YYYY hh:mm A')}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStudents(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (doc) => doc.role === 'STUDENT' && doc.school === user.schoolName
          )
      );
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const unsub = onSnapshot(
      query(
        collection(db, 'attendance'),
        where('createdAt', '>=', startOfDay),
        where('createdAt', '<', endOfDay)
      ),
      (snapshot) => {
        if (students) {
          const attendanceData = snapshot.docs.map((doc) => {
            const student = students.find((s) => s.id === doc.data().userId);
            return {
              id: doc.id,
              ...doc.data(),
              name: getFullName({ row: student }),
              idNumber: student.idNumber,
            };
          });
          setRows(attendanceData);
        }
      }
    );

    return () => {
      unsub();
    };
  }, [students]);

  const filteredRows = rows.filter((r) => r.isMorning === filter);

  const allCurrStudents = students.length;
  const studentsInSchool = rows.filter((r) => r.status === 'IN').length;
  const studentsNotInSchool = rows.filter((r) => r.status === 'OUT').length;

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      headerClassName: 'header',
    },
    {
      field: 'idNumber',
      headerName: 'ID Number',
      flex: 1,
      headerClassName: 'header',
    },
    {
      field: 'createdAt',
      headerName: 'Time',
      flex: 0.5,
      valueGetter: getTime,
      headerClassName: 'header',
    },
    {
      field: 'status',
      headerName: 'In/Out',
      flex: 0.5,
      headerClassName: 'header',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2} fontWeight="bold">
        {user.schoolName}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          mb: 2,
        }}
      >
        <InfoBox name="Students" count={allCurrStudents} />
        <InfoBox name="In School" count={studentsInSchool} />
        <InfoBox name="Not in School" count={studentsNotInSchool} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Select
          defaultValue={true}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          id="filter"
          sx={{ bgcolor: '#b0bfe9', minWidth: '200px' }}
        >
          <MenuItem value={true}>Morning</MenuItem>
          <MenuItem value={false}>Afternoon</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          '.header': {
            bgcolor: '#b0bfe9',
          },
        }}
      >
        <DataGrid
          sx={{ border: 'none', bgcolor: 'white' }}
          columns={columns}
          rows={filteredRows}
          hideFooter
          autoHeight
        />
      </Box>
    </Box>
  );
};

export default Admin;

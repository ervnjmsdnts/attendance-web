import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

const DailyReport = () => {
  const [date, setDate] = useState(moment());
  const [students, setStudents] = useState([]);
  const [rows, setRows] = useState([]);

  const getFullName = (params) => {
    return `${params.row.firstName} ${params.row.middleName} ${params.row.lastName}`;
  };

  const user = JSON.parse(localStorage.getItem('profile'));

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
    const startOfDay = date.startOf('day').toDate();
    const endOfDay = date.endOf('day').toDate();
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
  }, [students, date]);

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
      <Box mb={2}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            views={['month', 'day']}
            value={date}
            onChange={(value) => setDate(value)}
            sx={{ bgcolor: '#b0bfe9', borderRadius: 1 }}
          />
        </LocalizationProvider>
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
  );
};

export default DailyReport;

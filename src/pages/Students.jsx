import { Box, Button, Dialog } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import QRCode from 'qrcode';

const QRDialog = ({ onClose, open, student }) => {
  const [QRSrc, setQRSrc] = useState('');
  const onDownload = (href) => {
    const link = document.createElement('a');
    link.download = `QRS${student.idNumber}.png`;
    link.href = href;
    link.click();
  };

  useEffect(() => {
    if (student && Object.keys(student)) {
      QRCode.toDataURL(
        `${JSON.stringify({ idNumber: student.idNumber })}`
      ).then(setQRSrc);
    }
  });

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        display="flex"
        p="32px"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        <Box
          component="img"
          src={QRSrc}
          alt="dialogQR"
          width="200px"
          height="200px"
        />
        <Button onClick={() => onDownload(QRSrc)} fullWidth variant="contained">
          Download
        </Button>
      </Box>
    </Dialog>
  );
};

const Students = () => {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const user = JSON.parse(localStorage.getItem('profile'));

  const getFullName = (params) => {
    return `${params.row.firstName} ${params.row.middleName} ${params.row.lastName}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setRows(
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

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: getFullName,
      headerClassName: 'header',
    },
    {
      field: 'idNumber',
      headerName: 'ID Number',
      flex: 1,
      headerClassName: 'header',
    },
    {
      field: 'qrCode',
      headerName: 'QR Code',
      headerClassName: 'header',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => {
            setSelectedStudent({
              idNumber: params.row.idNumber,
              name: getFullName(params),
            });
            setOpenModal(true);
          }}
        >
          Show QR Code
        </Button>
      ),
    },
  ];
  return (
    <>
      <QRDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        student={selectedStudent}
      />
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
          rows={rows}
          hideFooter
          autoHeight
        />
      </Box>
    </>
  );
};

export default Students;

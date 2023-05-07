import {
  AccountCircle,
  Article,
  Dashboard,
  Groups,
  Groups2,
  Logout,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const drawerWidth = 240;

const listItems = [
  {
    name: 'Dashboard',
    link: '/',
    Icon: Dashboard,
  },
  {
    name: 'Daily Report',
    link: '/daily-report',
    Icon: Article,
  },
  {
    name: 'Teachers',
    link: '/teachers',
    Icon: Groups2,
  },
  {
    name: 'Students',
    link: '/students',
    Icon: Groups,
  },
];

const Navigation = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem('profile');
    window.location.href = '/';
  };

  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: '#131729' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: '#131729',
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="white"
              >
                <AccountCircle sx={{ color: 'primary.main' }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                sx={{ mt: '40px' }}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: '16px',
                    py: '8px',
                    gap: '32px',
                    minWidth: 350,
                  }}
                >
                  <Box display="flex" flexDirection="column" gap="8px">
                    <Typography fontWeight="bold">Email:</Typography>
                    <Typography>{user.email}</Typography>
                    <Typography fontWeight="bold">School Name:</Typography>
                    <Typography>{user.schoolName}</Typography>
                  </Box>
                  <Avatar
                    sx={{ width: 64, height: 64 }}
                    src={user.schoolLogo}
                  />
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          bgcolor: '#131729',
          flexShrink: 0,
          color: 'white',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#131729',
            color: 'white',
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Box component="img" src={Logo} />
        </Toolbar>
        <Divider />
        <List>
          {listItems.map(({ name, link, Icon }, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton LinkComponent={Link} to={`admin${link}`}>
                <ListItemIcon>
                  <Icon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#131729',
          color: 'white',
          p: 3,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Navigation;

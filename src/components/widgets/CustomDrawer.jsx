/* eslint-disable react/prop-types */
import { Drawer, IconButton } from '@mui/material';
import Profile from '../../pages/Profile';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const CustomDrawer = ({ isOpen, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 600,
          backgroundColor: '#ffffff',
          paddingTop: '16px',
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >      <IoMdCloseCircleOutline size={24} className='text-black' />

        
      </IconButton>
     <Profile/>
    </Drawer>
  );
};

export default CustomDrawer;

import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Spinner() {
  return (
    <Box sx={{ display: 'flex',width: "100%", alignItems: 'center',justifyContent:'center',minHeight:"80px" }}>
      <CircularProgress />
    </Box>
  );
}
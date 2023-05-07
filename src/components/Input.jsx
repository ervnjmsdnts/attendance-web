import { Box, TextField } from '@mui/material';
import { forwardRef } from 'react';

const Input = forwardRef(({ errors, ...rest }, ref) => {
  return (
    <Box width="100%">
      <TextField
        ref={ref}
        error={errors}
        helperText={errors ? errors.message : null}
        fullWidth
        {...rest}
      />
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;

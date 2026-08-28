import React from 'react';
import { Box, BoxProps } from '@mui/material';

export const Flex = (props: BoxProps) => {
  const { sx, ...rest } = props;
  return <Box component="span" sx={{ display: 'flex', ...sx }} {...rest} />;
};

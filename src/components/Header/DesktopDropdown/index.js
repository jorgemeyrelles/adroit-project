import React, { useState, useContext } from 'react';

import {
  PowerSettingsNew, SwapHoriz, AccountCircle, Settings, Notifications,
} from '@mui/icons-material';
import {
  Typography, Badge, MenuItem, Box, Stack,
} from '@mui/material';

import { Popup, Icon } from './styles';

import { AuthContext } from '../../../context/AuthContext';
import { FieldViewModal } from '../../../containers/FieldViewModal';

export function DesktopDropdown() {
  const { handleSignOut } = useContext(AuthContext);

  const [fieldViewModalVisibility, setFieldViewModalVisibility] = useState(false);
  const [profileMenu, setProfileMenu] = useState(null);
  const [settingsMenu, setSettingsMenu] = useState(null);

  const handleCloseModalVisibility = () => {
    setFieldViewModalVisibility(false);
  };

  const handleOpenModalVisibility = () => {
    setFieldViewModalVisibility(true);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Icon disableRipple onClick={(event) => setProfileMenu(event.currentTarget)}>
          <AccountCircle />
        </Icon>

        <Icon disableRipple>
          <Badge color="error" badgeContent={0}>
            <Notifications />
          </Badge>
        </Icon>

        <Icon
          disableRipple
          id="settings-button"
          onClick={(event) => setSettingsMenu(event.currentTarget)}
        >
          <Settings />
        </Icon>
      </Stack>

      <Popup
        elevation={0}
        anchorEl={profileMenu}
        open={!!profileMenu}
        onClose={() => setProfileMenu(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ p: 0 }}
      >
        <MenuItem
          dense
          onClick={handleSignOut}
          sx={{ height: 41 }}
        >
          <PowerSettingsNew shapeRendering="geometricPrecision" />
          <Typography>Sign out</Typography>
        </MenuItem>
      </Popup>

      <Popup
        elevation={0}
        anchorEl={settingsMenu}
        open={!!settingsMenu}
        onClose={() => setSettingsMenu(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          dense
          onClick={handleOpenModalVisibility}
          sx={{ height: 41 }}
          disabled
        >
          <SwapHoriz shapeRendering="geometricPrecision" />
          <Typography>Climate FieldView</Typography>
        </MenuItem>
      </Popup>

      <FieldViewModal
        onClose={handleCloseModalVisibility}
        isOpen={fieldViewModalVisibility}
      />
    </Box>
  );
}

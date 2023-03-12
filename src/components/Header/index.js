import React from 'react';

import { AppBar, Link, Toolbar } from '@mui/material';
import { DesktopDropdown } from './DesktopDropdown';
import generatedGitInfo from '../../generatedGitInfo.json';

import { Commit } from './styles';
import { showVersion } from '../../utils/format';
import { axiosInstance } from '../../service/axiosUtils';

export function Header() {
  const handleClick = () => { localStorage.removeItem('reportId'); };

  axiosInstance.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`;

  const lastCommitGit = () => {
    if (showVersion() === 'development' || showVersion() === 'test') {
      return (
        <Commit sx={{ display: { xs: 'none', sm: 'block' } }}>
          <span>
            last commit:
            {showVersion() === 'test' && (
              <span
                title={generatedGitInfo.gitBranch}
                className="branch"
              >
                {` ${generatedGitInfo.gitBranch}`}
              </span>
            )}
          </span>
          <span
            title={generatedGitInfo.gitCommitHash}
            className="textCommit"
          >
            {generatedGitInfo.gitCommitHash}
          </span>
          <span className="version">
            {`version: ${showVersion()}`}
          </span>
        </Commit>
      );
    }
    return false;
  };

  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{ bgcolor: '#fff' }}
    >
      <Toolbar
        disableGutters
        sx={{ justifyContent: 'space-between' }}
      >
        <Link
          onClick={() => handleClick()}
          href="/dashboard"
        >
          <img
            width="79px"
            height="79px"
            src="/assets/header-logo.png"
            alt="Leafsense"
          />
        </Link>

        {showVersion() !== 'production' && lastCommitGit()}

        <DesktopDropdown />
      </Toolbar>
    </AppBar>
  );
}

import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';

import { useNavigate } from 'react-router';
import {
  CircularProgress, Divider, Tooltip, Typography,
} from '@mui/material';
import { Add, MoreHoriz } from '@mui/icons-material';

import { ReportsButton } from './ReportsButton';
import {
  AddReport, Container, ScrollableArea, ShowMoreButton,
} from './styles';

import { StateGlobal } from '../../context/StateGlobal';
import { apiReports } from '../../service/apiReports';
import { isExpiredToken } from '../../utils/getValidationErrors';
import { ReportsSummary } from '../ReportsSummary';
import { storage } from '../../utils/hooks/useLocalStorage';

export function ReportsBar() {
  const { setCreateReportModalVisibility, setUpdate } = useContext(StateGlobal);
  const navigate = useNavigate();

  const [limitReports, setLimitReports] = useState(3);
  const [loading, setLoading] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  const local = storage.get('report');
  const token = storage.get('token');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let isMounted = true;

    setReportSaved(false);
    if (isMounted) {
      apiReports.getAllReports(signal)
        .then((data) => {
          if (data && data.length > 0) {
            storage.set('report', data);
            return setReportSaved(true);
          }
          setReportSaved(true);
          return storage.set('report', []);
        })
        .catch((error) => {
          if (isExpiredToken(token)) {
            storage.clean();
            return navigate('/');
          }
          return error;
        });
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const reports = useMemo(() => {
    if (local) {
      const rep = local.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));
      return rep;
    }
    return ([]);
  }, [local, reportSaved]);

  useEffect(() => {
    setLoading(true);
  }, [reports]);

  function handleShowAllReports() {
    setLimitReports(1000);
  }

  return (
    <>
      <Container>
        {loading && (
          <div>
            <AddReport
              color="primary"
              variant="outlined"
              endIcon={<Add />}
              onClick={() => {
                setCreateReportModalVisibility(true);
                setUpdate({ loading: false, data: [] });
              }}
            >
              <Typography>Novo</Typography>
            </AddReport>

            <ScrollableArea>
              {(reports.length) ? (
                reports.slice(0, limitReports).map((report) => (
                  <ReportsButton
                    key={`report-dropdown-${report.report_id}`}
                    data={report}
                  />
                )))
                : (
                  <div>
                    {!reportSaved && (
                      <CircularProgress
                        style={{ verticalAlign: '-webkit-baseline-middle' }}
                        color="primary"
                        size={20}
                      />
                    )}
                  </div>
                )}
              {(reports.length > 3 && limitReports === 3) && (
                <Tooltip
                  title="Ver mais"
                  sx={{
                    display: 'flex',
                    alignSelf: 'flex-end',
                  }}
                >
                  <ShowMoreButton
                    style={{ alignSelf: 'stretch' }}
                    onClick={() => handleShowAllReports()}
                  >
                    <MoreHoriz />
                  </ShowMoreButton>
                </Tooltip>
              )}
            </ScrollableArea>
          </div>
        )}
      </Container>

      <Divider sx={{ mt: 0.5, mb: 2 }} />

      <ReportsSummary reports={reports} />
    </>
  );
}

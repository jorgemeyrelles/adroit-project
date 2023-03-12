import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Slide, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useParams } from 'react-router';
import { format, parseISO } from 'date-fns';
import {
  Container, Divider, SummaryButton, Wrapper,
} from './styles';

export function ReportsSummary({ reports }) {
  const params = useParams();
  const buttonRef = useRef(null);
  const [activeReport, setActiveReport] = useState();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    if (params.id !== undefined) {
      const findReport = reports.filter((report) => params.id === report.report_id);
      // console.log(findReport);
      setActiveReport(...findReport);
    }
  }, [params]);

  const handleToggleSummary = () => {
    setIsSummaryOpen(!isSummaryOpen);
  };

  return (
    <div>
      {activeReport && (
        <Wrapper>
          <SummaryButton
            fullWidth
            disableElevation
            disableRipple
            disableFocusRipple
            variant="outlined"
            color="primary"
            endIcon={<ExpandMore />}
            open={isSummaryOpen}
            onClick={handleToggleSummary}
          >
            <Typography>
              {`${activeReport && (format(parseISO(activeReport.period[0]), 'dd/MM/yyyy'))} - 
              ${activeReport && (format(parseISO(activeReport.period[1]), 'dd/MM/yyyy'))}`}
            </Typography>

          </SummaryButton>
          <Box sx={{ overflow: 'hidden' }} ref={buttonRef}>
            <Slide
              direction="down"
              in={isSummaryOpen}
              container={buttonRef.current}
              mountOnEnter
              unmountOnExit
              timeout={200}
            >
              <Container>
                <Divider />

                <Typography sx={{ display: `${activeReport.varieties.length ? 'flex' : 'none'}` }}>
                  Variedades:&nbsp;
                  <span>
                    {activeReport.varieties.map((item) => item.name).join(', ')}
                  </span>
                </Typography>

                <Typography sx={{ display: `${activeReport.spacing.length ? 'flex' : 'none'}` }}>
                  Espaçamentos:&nbsp;
                  <span>
                    {activeReport.spacing.map((item) => item.name).join(', ')}
                  </span>
                </Typography>

                <Typography sx={{ display: `${activeReport.ages.length ? 'flex' : 'none'}` }}>
                  Idade:&nbsp;
                  <span>
                    {activeReport.ages.map((item) => item.name).join(', ')}
                  </span>
                </Typography>

                <Typography sx={{ display: `${activeReport.grafts.length ? 'flex' : 'none'}` }}>
                  Enxerto:&nbsp;
                  <span>
                    {activeReport.grafts.map((item) => item.name).join(', ')}
                  </span>
                </Typography>

                <Typography>
                  Quadras:&nbsp;
                  <span>
                    {activeReport.blocks.map((item) => item.name).sort((a, b) => a - b).join(', ')}
                  </span>
                </Typography>
              </Container>
            </Slide>
          </Box>
        </Wrapper>
      )}
    </div>
  );
}

ReportsSummary.propTypes = {
  reports: PropTypes.object,
}.isRequired;

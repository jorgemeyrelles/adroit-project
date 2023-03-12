import React, {
  useMemo, useCallback, useContext, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import { useNavigate, useParams } from 'react-router-dom';
import {
  addDays, format, formatISO, parseISO,
} from 'date-fns';
import {
  Box, Button, CircularProgress, ClickAwayListener, Grow, Typography,
} from '@mui/material';
import {
  Delete, Edit, MoreVert,
  CheckCircle, DeleteOutline, EditOutlined, HighlightOff,
} from '@mui/icons-material';
import {
  DeleteTooltip,
  FarmDataTooltip,
  MenuButton,
  MenuPopup,
  OverFlowText,
  ReportButtonGroup, ReportNameButton,
} from './styles';
import { ChartContext } from '../../../context/ChartContext';
import { StateGlobal } from '../../../context/StateGlobal';
import { MapContext } from '../../../context/MapContext';
import { allReports, deleteOne } from '../../../service/apiReports';
import { createError, getValidationErrors } from '../../../utils/getValidationErrors';
import { emptyBlock, formatEndDate } from '../../../utils/format';

export function ReportsButton({ data }) {
  const dropDownRef = useRef(null);
  const navigate = useNavigate();

  const {
    setRenderCenter,
    clearHeatmaps,
    setSelectedMap,
    setBlocksResponse,
    setPropArr,
  } = useContext(MapContext);
  const {
    setParams,
    setIsLoading,
    setChartsSelected,
    isLoading,
  } = useContext(ChartContext);
  const { setUpdate, setCreateReportModalVisibility, setFilterBar } = useContext(StateGlobal);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteTooltip, setOpenDeleteTooltip] = useState(false);

  const open = Boolean(anchorEl);
  const getInitialDate = formatISO(new Date(data.period[0]));
  const getFinalDate = formatISO(new Date(data.period[1]));

  const initialDate = format(addDays(parseISO(getInitialDate), 1), 'dd/MM/yyyy');
  const finalDate = format(addDays(parseISO(getFinalDate), 1), 'dd/MM/yyyy');

  const handleReportNavigation = useCallback(
    () => {
      setIsLoading({
        table: true,
        ripening: true,
        diameter: true,
        treeHeight: true,
        onGround: true,
        inventory: true,
      });
      clearHeatmaps();
      setChartsSelected([]);
      setSelectedMap(false);
      setPropArr([]);
      setFilterBar([]);

      const report = data.report_id !== '' && JSON.parse(localStorage.getItem('report'));
      const selectedReport = report && report.find((e) => e.report_id === data.report_id);

      // const lastday = (addDays(new Date(selectedReport?.period[1]), 1)).toISOString();

      const dateAndId = {
        startDate: new Date(selectedReport.period[0]).toISOString(),
        endDate: new Date(selectedReport.period[1]).toISOString(),
        id: data.report_id,
      };
      setBlocksResponse(emptyBlock(true, dateAndId));
      if (report) {
        const toReport = {
          ...selectedReport,
          period: [
            selectedReport?.period[0],
            selectedReport?.period[1],
            formatEndDate(selectedReport?.period[1]),
          ],
        };

        setParams(
          { redirect: true, value: toReport },
        );
      }
      setRenderCenter(true);
      return navigate(`/report/${data.report_id}`);
    },
    [],
  );

  const selectedReport = useMemo(
    () => data.report_id === id,
    [id],
  );

  const handleShowHiddenContent = (e) => {
    e.target.style.whiteSpace = 'initial';
  };

  const returnDropDown = (list) => {
    if (list.length === 0) {
      return '';
    }
    const entireList = list.slice(0).map((named, index) => {
      if (index !== list.slice(0).length - 1) {
        return named.name;
      }
      return named.name;
    });
    return entireList;
  };

  const handleDelete = async (reportId, check) => {
    try {
      if (check === 'no-delete') {
        throw createError();
      }
      // pegar token
      const token = JSON.parse(localStorage.getItem('token'));
      // deletar
      setLoading(true);
      setIsDeleting(true);
      await deleteOne(token, reportId);
      // getAll
      const allReportsUpdated = await allReports(token);
      // set localstorage
      localStorage.setItem('report', JSON.stringify(allReportsUpdated));
    } catch (error) {
      getValidationErrors(error);
    } finally {
      setIsDeleting(false);
      if (check === 'no-delete') {
        setOpenDeleteTooltip(false);
      } else {
        setOpenDeleteTooltip(false);
        // navigate to dashboard
        navigate('/dashboard');
      }
    }
  };

  const validationLoading = id ? Object.values(isLoading).every((e) => e === false) : true;

  const handleClickAway = () => {
    setOpenDeleteTooltip(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <ReportButtonGroup
        ref={dropDownRef}
        disableRipple
        disableElevation
        color="primary"
        variant="outlined"
        selected={selectedReport}
        disabled={isDeleting}
      >
        <FarmDataTooltip
          arrow
          title={(
            <div>
              <div>
                <OverFlowText>
                  <strong>
                    <Box
                      component="span"
                      style={{ cursor: 'pointer' }}
                      onClick={handleShowHiddenContent}
                    >
                      {returnDropDown(data.farm)}
                    </Box>
                  </strong>
                </OverFlowText>
                <span style={{ fontSize: '14px' }}>
                  {`${initialDate} - ${finalDate}`}
                </span>
              </div>

              {data.varieties.length !== 0 && (
                <>
                  <strong style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>Variedades: </strong>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <OverFlowText>
                      <Box
                        component="span"
                        style={{ cursor: 'pointer' }}
                        onClick={handleShowHiddenContent}
                      >
                        {returnDropDown(data.varieties).sort().join(', ')}
                      </Box>
                    </OverFlowText>
                  </div>
                </>
              )}

              {data.spacing.length !== 0 && (
                <>
                  <strong style={{ fontSize: '1.05rem', margin: '0.1rem 0 0.3rem 0' }}>Espaçamentos: </strong>
                  <OverFlowText>
                    <Box
                      component="span"
                      style={{ cursor: 'pointer' }}
                      onClick={handleShowHiddenContent}
                    >
                      {returnDropDown(data.spacing).sort().join(', ')}
                    </Box>
                  </OverFlowText>
                </>
              )}

              {data.ages.length !== 0 && (
                <>
                  <strong style={{ fontSize: '1.05rem', margin: '0.1rem 0 0.3rem 0' }}>Idades: </strong>
                  <OverFlowText>
                    <Box
                      component="span"
                      style={{ cursor: 'pointer' }}
                      onClick={handleShowHiddenContent}
                    >
                      {returnDropDown(data.ages).sort().join(', ')}
                    </Box>
                  </OverFlowText>
                </>
              )}

              {data.grafts.length !== 0 && (
                <>
                  <strong style={{ fontSize: '1.05rem', margin: '0.1rem 0 0.3rem 0' }}>Enxertos: </strong>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <OverFlowText>
                      <Box
                        component="span"
                        style={{ cursor: 'pointer' }}
                        onClick={handleShowHiddenContent}
                      >
                        {returnDropDown(data.grafts).sort().join(', ')}
                      </Box>
                    </OverFlowText>
                  </div>
                </>
              )}

              {data.blocks.length !== 0 && (
                <>
                  <strong style={{ fontSize: '1.05rem', margin: '0.1rem 0 0.3rem 0' }}>Quadras: </strong>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <OverFlowText>
                      <Box
                        component="span"
                        style={{ cursor: 'pointer' }}
                        onClick={handleShowHiddenContent}
                      >
                        {returnDropDown(data.blocks).sort((a, b) => a - b).join(', ')}
                      </Box>
                    </OverFlowText>
                  </div>
                </>
              )}
            </div>
          )}
        >
          <ReportNameButton
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => {
              handleReportNavigation();
            }}
          >
            <span title={data.name.toString().toUpperCase()}>
              {data.name.toString().toUpperCase()}
            </span>
          </ReportNameButton>
        </FarmDataTooltip>
        <MenuButton
          id="menu-button"
          aria-controls={open ? 'customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleMenuClick}
        >
          <MoreVert />
        </MenuButton>

        <MenuPopup
          id="customized-menu"
          MenuListProps={{
            'aria-labelledby': 'menu-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Grow
            in={open}
            {...(open ? { timeout: 500 } : {})}
          >
            <span>
              <Typography>Editar</Typography>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                disabled={!validationLoading}
                onClick={() => {
                  setUpdate({ loading: true, data: data.report_id });
                  setCreateReportModalVisibility(true);
                  setAnchorEl(false);
                }}
              >
                {selectedReport ? (
                  <Edit fontSize="small" />
                ) : (
                  <EditOutlined fontSize="small" />
                )}
              </Button>
            </span>
          </Grow>

          <Grow
            in={open}
            {...(open ? { timeout: 800 } : {})}
          >
            <span>
              <Typography>Excluir</Typography>
              <DeleteTooltip
                open={openDeleteTooltip}
                placement="right"
                arrow
                title={(
                  <div>
                    <p>Excluir o relatório?</p>
                    <div>
                      {loading ? (
                        <CircularProgress
                          sx={{
                            color: 'white',
                            margin: '3px auto 5px',
                          }}
                          size={20}
                        />
                      ) : (
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div>
                            <Button
                              size="small"
                              onClick={() => handleDelete(data.report_id, 'delete')}
                            >
                              <CheckCircle
                                fontSize="small"
                                sx={{ color: '#fff' }}
                              />
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleDelete(data.report_id, 'no-delete')}
                            >
                              <HighlightOff
                                fontSize="small"
                                sx={{ color: '#fff' }}
                              />
                            </Button>
                          </div>
                        </ClickAwayListener>
                      )}
                    </div>
                  </div>
                )}
              >
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  disabled={!validationLoading}
                  onClick={() => {
                    setOpenDeleteTooltip((e) => !e);
                  }}
                >
                  {selectedReport ? (
                    <Delete fontSize="small" />
                  ) : (
                    <DeleteOutline fontSize="small" />
                  )}
                </Button>
              </DeleteTooltip>
            </span>
          </Grow>
        </MenuPopup>

      </ReportButtonGroup>
    </div>
  );
}

ReportsButton.propTypes = {
  children: PropTypes.node,
}.isRequired;

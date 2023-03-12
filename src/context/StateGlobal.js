/* eslint-disable import/no-cycle */
import React, { createContext, useMemo, useState } from 'react';
import { subDays } from 'date-fns';
import PropTypes from 'prop-types';
import { AuthProvider } from './AuthContext';
import { ChartProvider } from './ChartContext';
import { MapProvider } from './MapContext';

export const StateGlobal = createContext();
export function StateProvider({ children }) {
  const [createReportModalVisibility, setCreateReportModalVisibility] = useState(false);

  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [update, setUpdate] = useState({ loading: false, data: [] });
  const [visited, setVisited] = useState([]);
  const [filterBar, setFilterBar] = useState([]);
  const [currentReport, setCurrentReport] = useState();
  const [custom, setCustom] = useState(false);

  const value = useMemo(() => ({
    period: {
      startDate,
      endDate,
    },
    setEndDate,
    setStartDate,
    createReportModalVisibility,
    setCreateReportModalVisibility,
    update,
    setUpdate,
    visited,
    setVisited,
    filterBar,
    setFilterBar,
    currentReport,
    setCurrentReport,
    custom,
    setCustom,
  }), [createReportModalVisibility, startDate, endDate, filterBar, visited]);

  return (
    <StateGlobal.Provider value={value}>
      <AuthProvider>
        <ChartProvider>
          <MapProvider>
            {children}
          </MapProvider>
        </ChartProvider>
      </AuthProvider>
    </StateGlobal.Provider>
  );
}

StateProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;

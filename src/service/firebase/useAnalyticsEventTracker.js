import ReactGA from 'react-ga';

const useAnalyticsEventTracker = (category = 'Blog category') => {
  // ReactGA.initialize(process.env.REACT_APP_FIREBASE_KEY);
  const eventTracker = (action = 'test action', label = 'test label') => {
    // console.log(category, action, label);
    ReactGA.event({ category, action, label });
  };
  return eventTracker;
};

const useAnalyticsTiming = (category = 'API category') => {
  // ReactGA.initialize(process.env.REACT_APP_FIREBASE_KEY);
  const timingTracker = (variable = 'test variable', value = 0, label = 'test label') => {
    // console.log(category, action, label);
    ReactGA.timing({
      category,
      variable,
      value,
      label,
    });
  };
  // https://bestofreactjs.com/repo/react-ga-react-ga-react-react-integration
  // https://reactgo.com/javascript-function-execution-time/
  return timingTracker;
};

const usePageViewTracker = (location = '/path') => {
  // console.log(location.pathname);
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(
    location.pathname,
    { debug: true },
  );
};

export {
  useAnalyticsEventTracker,
  usePageViewTracker,
  useAnalyticsTiming,
};

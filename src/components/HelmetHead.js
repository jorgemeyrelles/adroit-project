import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export function HelmetHead(props) {
  const { title } = props;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <link rel="icon" type="image/png" href="/assets/leafsense.png" />
      </Helmet>
    </div>
  );
}

HelmetHead.propTypes = {
  title: PropTypes.string,
}.isRequired;

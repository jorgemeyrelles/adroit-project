import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { PdfGenerate } from './PdfGenerate';

function PdfCreator(props) {
  const {
    filterSelected,
  } = props;
  // const pdfExportComponent = useRef(null);
  const { id } = useParams();

  return (
    <div>
      {filterSelected.length !== 0 && (
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-tertiary"
        style={{ margin: '0 50px 10px' }}
        onClick={() => {
          // setHeaderVis(true);
          PdfGenerate(id);
        }}
        type="button"
      >
        Export to PDF
      </button>
      )}
    </div>
  );
}

PdfCreator.propTypes = {
  props: PropTypes.node,
}.isRequired;

export { PdfCreator };

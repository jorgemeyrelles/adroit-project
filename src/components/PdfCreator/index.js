import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { Button } from '../Touchables/Button';
import { theme } from '../../pages/themes/default';

function PdfCreator(props) {
  const {
    children,
    filterSelected,
  } = props;

  const local = JSON.parse(localStorage.getItem('report'));

  const { id } = useParams();

  const {
    ages,
    blocks,
    farm,
    grafts,
    // id,
    name,
    period,
    spacing,
    varieties,
  } = local.find((rep) => rep.report_id === id);

  // console.log(local);

  const componentRef = useRef(null);

  const verifyEmpty = (value) => {
    if (value.length === 0) {
      return '-';
    }
    return value.map((e) => e.name).join(', ');
  };

  const inputHeader = () => (
    <header
      style={{
        width: '93%',
        position: 'absolute',
        top: '10px',
        left: '10px',
        marginLeft: '25px',
        display: 'flex',
        border: '1px solid black',
        borderRadius: '10px',
      }}
    >
      <duv style={{ borderRight: '1px solid black', margin: '20px' }}>
        <img
          width="79px"
          height="79px"
          src="/assets/header-logo.png"
          alt="Leafsense"
        />
      </duv>
      <div
        style={{
          margin: '20px',
          display: 'flex',
        }}
      >
        <div
          style={{ width: 350 }}
        >
          <p>
            Nome:
            {' '}
            {name}
          </p>
          <p>
            Periodo:
            {' '}
            {`${period[0]} - ${period[1]}`}
          </p>
          <p>
            Fazenda:
            {' '}
            {farm[0].name}
          </p>
          <p>
            Quadras:
            {' '}
            {verifyEmpty(blocks)}
          </p>
        </div>
        <div
          style={{ width: 250 }}
        >
          <p>
            Idade:
            {' '}
            {verifyEmpty(ages)}
          </p>
          <p>
            Espaçamento:
            {' '}
            {verifyEmpty(spacing)}
          </p>
          <p>
            Variedade:
            {' '}
            {verifyEmpty(varieties)}
          </p>
          <p>
            Enxerto:
            {' '}
            {verifyEmpty(grafts)}
          </p>
        </div>
      </div>
    </header>
  );

  const pageStyle = `
    @media all {
      .page-break {
        display: none;
      }
    }

    @media print {
      .page-break {
        margin-top: 1rem;
        display: block;
        width: 500;
        page-break-before: auto;
      }
    }

    @media print {
      html, body {
        height: initial !important;
        overflow: initial !important;
        -webkit-print-color-adjust: exact;
      }
    }

    @page {
      margin: 10mm 0 0 -3.5mm;
      size: auto;
      scale: 70;
      align-content: center;
    }
  `;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Report for ${id}_${new Date().getFullYear()}/${new Date().getMonth()}`,
    // onAfterPrint: () => setHeaderVis(false),
    onBeforeGetContent: () => inputHeader(),
  });

  return (
    <div>
      {(filterSelected.length !== 0) && (
        <Button
          style={{
            backgroundColor: '#2B4976',
            color: 'white',
            position: 'relative',
            left: '1.4rem',
            fontSize: 'x-small',
            fontWeight: 'bolder',
            marginBottom: '5px',
          }}
          sx={{
            marginLeft: '5px',
            [theme.breakpoints.down('md')]: {
              fontSize: 'small',
            },
          }}
          onClick={() => {
            handlePrint();
          }}
          type="button"
        >
          Exportar em PDF
        </Button>
      )}
      <div ref={componentRef}>
        <style type="text/css" media="print">
          {pageStyle}
        </style>
        <div className="page-break" />
        {children}
      </div>
    </div>
  );
}

PdfCreator.propTypes = {
  props: PropTypes.node,
}.isRequired;

export { PdfCreator };

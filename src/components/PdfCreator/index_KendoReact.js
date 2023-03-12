import React, { useRef } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

function PdfCreator(props) {
  const {
    children,
    filterSelected,
  } = props;
  const pdfExportComponent = useRef(null);

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

  // console.log(name, period, ages.map((e) => e.id).join(', '));

  // const exportPDFWithMethod = () => {
  //   const element = document.querySelector('.k-grid') || document.body;
  //   savePDF(element, {
  //     paperSize: 'A4',
  //   });
  // };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  const verifyEmpty = (value) => {
    if (value.length === 0) {
      return '-';
    }
    return value.map((e) => e.name).join(', ');
  };

  // console.log(filterSelected);

  const inputHeader = () => (
    <header
      style={{
        width: '93%',
        position: 'absolute',
        top: '10px',
        left: '10px',
        marginLeft: '50px',
        display: 'flex',
        border: '1px solid black',
        borderRadius: '10px',
      }}
    >
      <div style={{ borderRight: '1px solid black', margin: '20px' }}>
        <img
          width="79px"
          height="79px"
          src="/assets/header-logo.png"
          alt="Leafsense"
        />
      </div>
      <div
        style={{
          // position: 'absolute',
          // top: '10px',
          // left: '10px',
          margin: '20px',
          display: 'flex',
        }}
      >
        <div
          style={{ width: 350 }}
        >
          <h5>
            Nome:
            {' '}
            {name}
          </h5>
          <h5>
            Periodo:
            {' '}
            {`${period[0]} - ${period[1]}`}
          </h5>
          <h5>
            Fazenda:
            {' '}
            {farm[0].name}
          </h5>
          <h5>
            Quadras:
            {' '}
            {verifyEmpty(blocks)}
          </h5>
        </div>
        <div
          style={{ width: 250 }}
        >
          <h5>
            Idade:
            {' '}
            {verifyEmpty(ages)}
          </h5>
          <h5>
            Espaçamento:
            {' '}
            {verifyEmpty(spacing)}
          </h5>
          <h5>
            Variedade:
            {' '}
            {verifyEmpty(varieties)}
          </h5>
          <h5>
            Enxerto:
            {' '}
            {verifyEmpty(grafts)}
          </h5>
        </div>
      </div>
    </header>
  );

  return (
    <div>
      {(filterSelected.length !== 0 && false) && (
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-tertiary"
        style={{ margin: '0 50px 10px', padding: '0 5px' }}
        onClick={() => exportPDFWithComponent()}
        type="button"
        disabled={filterSelected.length === 0}
      >
        Exportar em PDF
      </button>
      )}
      <PDFExport
        forcePageBreak="#page-break"
        ref={pdfExportComponent}
        pageTemplate={inputHeader}
        paperSize="A4"
        // scale={0.6}
        margin={{
          top: 90, left: 40, right: 40, bottom: 30,
        }}
        fileName={`Report for ${id}_${new Date().getFullYear()}`}
        author="Adroit Developer Team"
        landscape
      >
        {children}
        <footer />
      </PDFExport>
    </div>
  );
}

PdfCreator.propTypes = {
  props: PropTypes.node,
}.isRequired;

export { PdfCreator };

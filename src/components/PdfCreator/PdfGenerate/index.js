/* eslint-disable new-cap */
import React from 'react';
// import jsPDF from 'jspdf';
import { html2pdf } from 'html2pdf.js';

const local = JSON.parse(localStorage.getItem('report'));

const inputHeader = (id) => {
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
  } = local.find((rep) => Number(rep.id) === Number(id));

  const verifyEmpty = (value) => {
    if (value.length === 0) {
      return '-';
    }
    return value.map((e) => e.name).join(', ');
  };
  return (
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
};

const PdfGenerate = (id) => {
  // const doc = new jsPDF('p', 'pt', 'A4');
  // doc.addJS(inputHeader(id));
  const doc = new html2pdf();
  const opt = {
    margin: 1,
    filename: `Report for ${id}_${new Date().getFullYear()}/${new Date().getMonth()}`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    Headers: inputHeader(),
  };
  doc.from(document.querySelector('#teste')).set(opt).save();
  // doc.html(document.querySelector('#teste'), {
  //   callback(pdf) {
  //     console.log(pdf);
  //     pdf.save(`Report for ${id}_${new Date().getFullYear()}/${new Date().getMonth()}`);
  //   },
  // });
};

export { PdfGenerate };

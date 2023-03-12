import React, {
  useMemo, useContext, useState, useCallback, useEffect,
} from 'react';

import { Bar, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { useParams, useNavigate } from 'react-router';
import {
  Box, LinearProgress, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,
} from '@mui/material';

import { ChartDetail } from '../ChartDetail';
import { MapDetail } from '../MapDetail';

import { EmptyReportDetail } from './EmptyReportDetail';

import { ChartContext } from '../../context/ChartContext';
import { PdfCreator } from '../../components/PdfCreator';
import {
  Container, Content, DesktopContainer, MapContainer,
} from './styles';
import { Sidebar } from '../../components/Sidebar';
import { isExpiredToken } from '../../utils/getValidationErrors';
import { storage } from '../../utils/hooks/useLocalStorage';

export function ReportDetail() {
  const {
    data, isLoading, chartsSelected,
  } = useContext(ChartContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const token = storage.get('token');

  useEffect(() => {
    if (isExpiredToken(token)) {
      localStorage.clear();
      navigate('/');
    }
  }, [chartsSelected]);

  const emptyChartsSelected = useMemo(
    () => chartsSelected.length === 0,
    [chartsSelected],
  );

  const [customAspectRatio, setCustomAspectRatio] = useState(1);

  const handleSizeChange = useCallback((size) => {
    setCustomAspectRatio(size === '32.5%' ? 1 : 3);
  }, []);

  useEffect(() => {
    setCustomAspectRatio(1);
  }, [chartsSelected]);

  return (
    <Container>
      <DesktopContainer component="aside">
        <Sidebar />
      </DesktopContainer>

      <PdfCreator filterSelected={chartsSelected}>
        {emptyChartsSelected ? (
          <EmptyReportDetail loading={isLoading} />
        ) : (
          <Content>
            {chartsSelected.includes('Mapa') && (
              <MapContainer>
                <MapDetail />
              </MapContainer>
            )}
            {chartsSelected.includes('Quantidade de Frutos') && (
              <div
                style={{
                  gridColumn: '1 / span 3',
                  textAlign: 'center',
                }}
              >
                <ChartDetail
                  key="block-amount-fruits"
                  chartName="Quantidade de Frutos"
                  blockName={`${data['2'].data
                    .map((item) => item.block)
                    .join(', ')}`}
                  variables={data['2'].data[0]?.variables || []}
                >
                  <div>
                    {
                      !isLoading.table && data['2'].length !== 0 ? (
                        <Box marginTop="20px" height="100%" width="100%">
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 650 }}
                              size="small"
                              aria-label="a dense table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Quadra</TableCell>
                                  {[
                                    'Fruta Madura',
                                    'Fruta Verde',
                                    'Fruta Semi Madura',
                                    'Madura Anomalia',
                                    'Verde Anomalia',
                                  ].map((item, ni) => (
                                    <TableCell
                                      key={`${item}-${ni + 1}`}
                                      align="center"
                                    >
                                      {item}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data['2'].data.map((item, n) => (
                                  <TableRow key={`table-row-${item.block}-${n + 1}`}>
                                    <TableCell align="center">
                                      {item.block}
                                    </TableCell>
                                    {item.data.map((fruit, i) => (
                                      <TableCell key={`${fruit.name}-${i + 1}`} align="center">
                                        {new Intl.NumberFormat('pt-BR').format(fruit.total)}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ) : (
                        <LinearProgress
                          style={{ fontSize: 50 }}
                          color="secondary"
                        />
                      )
                    }
                  </div>
                </ChartDetail>
              </div>
            )}
            {
              chartsSelected.includes('Maturação')
              && data['3'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block.name}`}
                  chartName="Estágio de Maturação"
                  blockName={block.block.name}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton={false}
                >
                  {!isLoading.ripening && block?.variables.reportId === id ? (
                    <Doughnut
                      data={block.data}
                      plugins={[ChartDataLabels]}
                      options={{
                        plugins: {
                          responsive: true,
                          legend: {
                            labels: (value) => {
                              const w = (value.chart.width);
                              if (w > 200 && w < 236) {
                                return ({
                                  font: {
                                    size: 10,
                                  },
                                  usePointStyle: true,
                                  pointStyle: 'circle',
                                });
                              }
                              if (w <= 200) {
                                return ({
                                  font: {
                                    size: 8,
                                  },
                                  usePointStyle: true,
                                  pointStyle: 'circle',
                                });
                              }
                              return ({
                                usePointStyle: true,
                                pointStyle: 'circle',
                              });
                            },
                          },
                          tooltip: {
                            enabled: (value) => {
                              const w = value.chart.width;
                              if (w < 200) {
                                return true;
                              }
                              return false;
                            },
                          },
                          datalabels: {
                            backgroundColor: (context) => context.dataset.colors,
                            borderColor: (context) => {
                              const { dataIndex } = context;
                              const w = context.chart.width;
                              if (context.dataset.data[dataIndex] && w > 200) {
                                return '#c3c3c3';
                              }
                              return null;
                            },
                            color: (context) => {
                              const { dataIndex } = context;
                              const w = context.chart.width;
                              if (context.dataset.data[dataIndex] && w > 200) {
                                return '#000';
                              }
                              return null;
                            },
                            borderRadius: 25,
                            borderWidth: 2,
                            font: (value) => {
                              const w = value.chart.width;
                              if (w < 236) {
                                return {
                                  weight: 'bold',
                                  size: Math.round(w / 24),
                                };
                              }
                              return {
                                weight: 'bold',
                              };
                            },
                            padding: (value) => {
                              const w = value.chart.width;
                              if (w < 236) {
                                return 2;
                              }
                              return 6;
                            },
                            display: true,
                            align: (value) => {
                              const { dataIndex } = value;
                              const w = value.chart.width;
                              if (value.dataset.data[dataIndex] < 0 || w < 236) {
                                return 'center';
                              }
                              return 'start';
                            },
                            anchor: (value) => {
                              const { dataIndex } = value;
                              const w = value.chart.width;
                              if (value.dataset.data[dataIndex] < 0 || w < 236) {
                                return 'center';
                              }
                              return 'center';
                            },
                            offset: 8,
                            formatter: (value, context) => {
                              const w = context.chart.width;
                              if (value !== undefined && w > 200) {
                                return `${(value)}%`;
                              }
                              return null;
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <LinearProgress
                      style={{ fontSize: 50 }}
                      color="secondary"
                    />
                  )}
                </ChartDetail>
              ))
            }
            {/* </div> */}

            {
              chartsSelected.includes('Diâmetro')
              && data['4'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block.name}`}
                  chartName="Distribuição de Diâmetro"
                  blockName={block.block.name}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  {!isLoading.diameter && block?.variables.reportId === id ? (
                    <Bar
                      data={block.data}
                      plugins={[ChartDataLabels]}
                      options={{
                        aspectRatio: customAspectRatio,
                        plugins: {
                          legend: {
                            labels: {
                              usePointStyle: true,
                              pointStyle: 'circle',
                            },
                            font: {
                              weight: 'bold',
                            },
                          },
                          datalabels: {
                            display: false,
                          },
                        },
                        scales: {
                          xAxes: {
                            title: {
                              color: '#161616',
                              display: true,
                              text: 'Diâmetro (mm)',
                            },
                          },
                          yAxes: {
                            title: {
                              color: '#161616',
                              display: true,
                              text: 'Ocorrência (%)',
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <LinearProgress
                      style={{ fontSize: 50 }}
                      color="secondary"
                    />
                  )}
                </ChartDetail>
              ))
            }
            {
              chartsSelected.includes('Altura das árvores')
              && data['5'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block.name}`}
                  chartName="Distribuição Altura das Árvores"
                  blockName={block.block.name}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  {!isLoading.treeHeight && block?.variables.reportId === id ? (
                    <Bar
                      data={block.data}
                      plugins={[ChartDataLabels]}
                      options={{
                        aspectRatio: customAspectRatio,
                        plugins: {
                          legend: {
                            labels: {
                              usePointStyle: true,
                              pointStyle: 'circle',
                            },
                          },
                          datalabels: {
                            display: false,
                          },
                        },
                        scales: {
                          xAxes: {
                            title: {
                              color: '#161616',
                              display: true,
                              text: 'Altura (m)',
                            },
                          },
                          yAxes: {
                            title: {
                              color: '#161616',
                              display: true,
                              text: 'Ocorrência (%)',
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <LinearProgress
                      style={{ fontSize: 50 }}
                      color="secondary"
                    />
                  )}
                </ChartDetail>
              ))
            }

            {
              chartsSelected.includes('Frutos no chão')
              && data['6'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block.name}`}
                  chartName="Distribuição de frutos no chão"
                  blockName={block.block.name}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  {!isLoading.onGround && block?.variables.reportId === id ? (
                    <Bar
                      data={block.data}
                      plugins={[ChartDataLabels]}
                      options={{
                        aspectRatio: customAspectRatio,
                        plugins: {
                          legend: {
                            labels: {
                              usePointStyle: true,
                              pointStyle: 'circle',
                            },
                          },
                          datalabels: {
                            display: false,
                          },
                        },
                        scales: {
                          xAxes: {
                            title: {
                              color: '#161616',
                              display: true,
                              text: 'Porcentagem de frutos no chão (%)',
                            },
                          },
                          yAxes: {
                            title: {
                              color: '#161616',
                              display: true,
                              text: 'Ocorrências (%)',
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <LinearProgress
                      style={{ fontSize: 50 }}
                      color="secondary"
                    />
                  )}
                </ChartDetail>
              ))
            }

            {
              chartsSelected.includes('Árvores ausentes')
              && data['7'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block.name}`}
                  chartName="Contagem de Árvores Ausentes"
                  blockName={block.block.name}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  <div>
                    {!isLoading && block?.variables.reportId === id ? (
                      <Bar
                        plugins={[ChartDataLabels]}
                        data={block.data}
                        height="100%"
                        width="100%"
                        options={{
                          aspectRatio: customAspectRatio,
                          plugins: {
                            legend: {
                              labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                              },
                            },
                            datalabels: {
                              display: false,
                            },
                          },
                        }}
                      />
                    ) : (
                      <LinearProgress
                        style={{ fontSize: 50 }}
                        color="secondary"
                      />
                    )}
                  </div>
                </ChartDetail>
              ))
            }

            {
              chartsSelected.includes('Anomalias na Florada')
              && data['8'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block}`}
                  chartName="Anomalias na Florada"
                  blockName={block.block}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  <div>
                    {!isLoading.flower && block ? (
                      <Bar
                        data={block.data}
                        height="100%"
                        width="100%"
                        plugins={[ChartDataLabels]}
                        options={{
                          aspectRatio: customAspectRatio,
                          plugins: {
                            legend: {
                              labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                              },
                            },
                            datalabels: {
                              display: false,
                            },
                          },
                          scales: {
                            xAxes: {
                              title: {
                                color: '#161616',
                                display: true,
                                text: 'Situação',
                              },
                            },
                            yAxes: {
                              title: {
                                color: '#161616',
                                display: true,
                                text: 'Quantidade',
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <LinearProgress
                        style={{ fontSize: 50 }}
                        color="secondary"
                      />
                    )}
                  </div>
                </ChartDetail>
              ))
            }
            {
              chartsSelected.includes('Inventário de plantas')
              && data['9'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block.name}`}
                  chartName="Inventário de plantas"
                  blockName={block.block.name}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  <div>
                    {!isLoading.inventory && block?.variables.reportId === id ? (
                      <Bar
                        data={block.data}
                        height="100%"
                        width="100%"
                        plugins={[ChartDataLabels]}
                        options={{
                          aspectRatio: customAspectRatio,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            datalabels: {
                              backgroundColor(context) {
                                return context.dataset.backgroundColor;
                              },
                              borderColor: '#c3c3c3',
                              color: '#000',
                              borderRadius: 25,
                              borderWidth: 2,
                              font: {
                                weight: 'bold',
                              },
                              padding: 4,
                              display: true,
                              align: (value) => {
                                const { dataIndex } = value;
                                if (value.dataset.data[dataIndex] < 0) {
                                  return 'start';
                                }
                                return 'center';
                              },
                              anchor: (value) => {
                                const { dataIndex } = value;
                                if (value.dataset.data[dataIndex] < 0) {
                                  return 'start';
                                }
                                return 'center';
                              },
                              // offset: 8,
                              formatter: (value) => {
                                if (value < 10) {
                                  return ` ${(value)} `;
                                }
                                return ` ${(value)} `;
                              },
                            },
                          },
                          scales: {
                            xAxes: {
                              title: {
                                color: '#161616',
                                display: true,
                                text: 'Tipos',
                              },
                            },
                            yAxes: {
                              title: {
                                color: '#161616',
                                display: true,
                                text: 'Ocorrência',
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <LinearProgress
                        style={{ fontSize: 50 }}
                        color="secondary"
                      />
                    )}
                  </div>
                </ChartDetail>
              ))
            }

            {
              chartsSelected.includes('Detecção de Anomalias')
              && data['10'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block}`}
                  chartName="Detecção de Anomalias"
                  blockName={block.block}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                  showSizeButton
                >
                  <div>
                    {!isLoading.anomaly && block ? (
                      <Bar
                        data={block.data}
                        height="100%"
                        width="100%"
                        plugins={[ChartDataLabels]}
                        options={{
                          aspectRatio: customAspectRatio,
                          plugins: {
                            legend: {
                              labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                              },
                            },
                            datalabels: {
                              display: false,
                            },
                          },
                          scales: {
                            // xAxes: {
                            // title: {
                            // color: '#161616',
                            // display: true,
                            // text: 'Diâmetro',
                            // },
                            // },
                            yAxes: {
                              title: {
                                color: '#161616',
                                display: true,
                                text: 'Ocorrência (%)',
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <LinearProgress
                        style={{ fontSize: 50 }}
                        color="secondary"
                      />
                    )}
                  </div>
                </ChartDetail>
              ))
            }
            {
              chartsSelected.includes('Cubicagem')
              && data['11'].data.map((block) => (
                <ChartDetail
                  key={`block-${block.block}`}
                  chartName="Cubicagem"
                  blockName={block.block}
                  variables={block.variables || []}
                  handleSizeChange={handleSizeChange}
                >
                  <div>
                    {!isLoading && block ? (
                      <Bar data={block.data} height="100%" width="100%" />
                    ) : (
                      <LinearProgress
                        style={{ fontSize: 50 }}
                        color="secondary"
                      />
                    )}
                  </div>
                </ChartDetail>
              ))
            }
          </Content>
        )}
      </PdfCreator>
    </Container>
  );
}

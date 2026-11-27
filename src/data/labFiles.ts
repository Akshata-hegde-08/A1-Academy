const base = import.meta.env.BASE_URL;
const codes = `${base}assets/aistudio/scilab-codes/`;
const pdfs = `${base}assets/aistudio/chemrecords/`;
const graphs = `${base}assets/aistudio/modelgraphs/`;

type LabFiles = {
  record?: string;
  scilab?: { label: string; url: string }[];
  graphs?: { label: string; url: string }[];
};

export const CHEM_LAB_FILES: Record<number, LabFiles> = {
  1: { record: pdfs+'Exp1.pdf', graphs: [{ label: 'Model Graph', url: graphs + 'exp1.png' }], scilab: [{ label: 'Scilab-code', url: codes + 'colorimetry.txt' }] },
  2: { record: pdfs+'exp2.pdf', graphs: [{ label: 'Model Graph', url: graphs + 'exp2.png' }], scilab: [{ label: 'Scilab-code', url: codes + 'conductometry.txt' }] },
  3: {
    record: pdfs+'exp3.pdf',
    graphs: [
      { label: 'Model Graph 1', url: graphs + 'exp3-g1.png' },
      { label: 'Model Graph 2', url: graphs + 'exp3-g2.png' },
    ],
    scilab: [
      { label: 'Scilab-code for Graph 1', url: codes + 'Ph-metry-g1.txt' },
      { label: 'Scilab-code for Graph 2', url: codes + 'ph-metry-g2.txt' },
    ],
  },
  4: { record: pdfs+'exp4.pdf', graphs: [{ label: 'Model Graph', url: graphs + 'exp4.png' }], scilab: [{ label: 'Scilab-code', url: codes + 'Potentiometry.txt' }] },
  5: { scilab: [{ label: 'Scilab-code', url: codes + 'coolingcurve.txt' }] },
  6: { record: pdfs+'exp6.pdf', graphs: [{ label: 'Model Graph', url: graphs + 'exp6.png' }], scilab: [{ label: 'Scilab-code', url: codes + 'viscosity.txt' }] },
  7: { record: pdfs+'exp7.pdf'},
};
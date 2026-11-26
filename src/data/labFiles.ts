const base = import.meta.env.BASE_URL;
const codes = `${base}assets/aistudio/scilab-codes/`;
const pdfs = `${base}assets/pdfs/chemistry/`;

type LabFiles = {
  record?: string;
  scilab?: { label: string; url: string }[];
};

export const CHEM_LAB_FILES: Record<number, LabFiles> = {
  1: { scilab: [{ label: 'Colorimetry', url: codes + 'colorimetry.txt' }] },
  2: { scilab: [{ label: 'Conductometry', url: codes + 'conductometry.txt' }] },
  3: {
    scilab: [
      { label: 'pH-metry Graph 1', url: codes + 'Ph-metry-g1.txt' },
      { label: 'pH-metry Graph 2', url: codes + 'ph-metry-g2.txt' },
    ],
  },
  4: { scilab: [{ label: 'Potentiometry', url: codes + 'Potentiometry.txt' }] },
  5: { scilab: [{ label: 'Cooling Curve', url: codes + 'coolingcurve.txt' }] },
  6: { scilab: [{ label: 'Viscosity', url: codes + 'viscosity.txt' }] },
};
import React, { useState, useMemo, useEffect } from 'react';
import {
  Sprout, AlertTriangle, CheckCircle2, TrendingUp, FileText, Loader2,
  ArrowRight, Beaker, Dna, Users, Phone, Mail, MessageSquare, X,
  Globe, ChevronRight, Search, Bell, Settings, LogOut, Edit3, Send,
  Download, PenTool, ArrowLeft, TrendingDown, Minus, ExternalLink
} from 'lucide-react';

// =====================================================================
// MOCK DATA — expanded to portfolio scale
// =====================================================================

const GROWERS = [
  { id: 'henderson', name: 'Henderson Farms', owner: 'Bill Henderson', phone: '(515) 555-0142', email: 'bill@hendersonfarms.com', relationship: '12 yrs', totalAcres: 840 },
  { id: 'martinez', name: 'Martinez Ag LLC', owner: 'Carlos Martinez', phone: '(515) 555-0187', email: 'carlos@martinezag.com', relationship: '7 yrs', totalAcres: 620 },
  { id: 'wright', name: 'Wright Family Farm', owner: 'Diane Wright', phone: '(641) 555-0203', email: 'diane@wrightfarm.net', relationship: '18 yrs', totalAcres: 1120 },
  { id: 'oconnell', name: "O'Connell Brothers", owner: 'Sean O\'Connell', phone: '(515) 555-0256', email: 'sean@oconnellbros.com', relationship: '4 yrs', totalAcres: 480 },
  { id: 'patel', name: 'Patel Grain Co.', owner: 'Raj Patel', phone: '(319) 555-0178', email: 'raj@patelgrain.com', relationship: '9 yrs', totalAcres: 760 },
  { id: 'johanssen', name: 'Johanssen Farms', owner: 'Erik Johanssen', phone: '(515) 555-0321', email: 'erik@johanssen.ag', relationship: '15 yrs', totalAcres: 950 },
  { id: 'tran', name: 'Tran Agriculture', owner: 'Minh Tran', phone: '(641) 555-0412', email: 'minh@tranag.com', relationship: '3 yrs', totalAcres: 340 },
  { id: 'baker', name: 'Baker Family Ranch', owner: 'Tom Baker', phone: '(515) 555-0534', email: 'tom@bakerranch.net', relationship: '22 yrs', totalAcres: 1380 },
];

// Historical pathogen data — 4 years of trend
const createHistoricalData = (currentValues, trendType) => {
  // trendType: 'rising', 'stable', 'falling'
  const years = [2023, 2024, 2025, 2026];
  return currentValues.map(pathogen => {
    const current = pathogen.pct;
    let history;
    if (trendType === 'rising') {
      history = [Math.max(10, current - 40), Math.max(15, current - 28), Math.max(20, current - 15), current];
    } else if (trendType === 'falling') {
      history = [Math.min(95, current + 30), Math.min(90, current + 18), Math.min(85, current + 8), current];
    } else {
      history = [current - 5, current + 3, current - 2, current];
    }
    return {
      ...pathogen,
      history: years.map((y, i) => ({ year: y, pct: Math.max(0, Math.min(100, history[i])) }))
    };
  });
};

const SAMPLE_FIELDS = {
  north40: {
    id: 'north40', growerId: 'henderson', name: 'North 40', acres: 80, crop: 'Soybean',
    previousCrop: 'Corn', region: 'Story County, IA', sampledOn: '2026-03-15',
    chemistry: { pH: 6.4, bpH: 6.8, OM: 3.2, P_bray: 18, K: 145, S: 12, Zn: 1.2, Ca: 1850, Mg: 320, Na: 45, CEC: 18.2, Nitrate: 8, Ammonium: 4, EC: 0.42 },
    pathogens: createHistoricalData([
      { name: 'Soybean Cyst Nematode (H. glycines)', pct: 85, impact: 'high', targetCrop: 'Soybean' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 72, impact: 'high', targetCrop: 'Soybean' },
      { name: 'Fusarium spp. (root rot complex)', pct: 55, impact: 'medium', targetCrop: 'Soybean' },
      { name: 'Pythium spp.', pct: 38, impact: 'medium', targetCrop: 'Soybean' },
      { name: 'Rhizoctonia solani', pct: 28, impact: 'low', targetCrop: 'Soybean' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'below_avg', P_solubilization: 'average' }
  },
  riverBottom: {
    id: 'riverBottom', growerId: 'henderson', name: 'River Bottom', acres: 120, crop: 'Corn',
    previousCrop: 'Soybean', region: 'Story County, IA', sampledOn: '2026-03-15',
    chemistry: { pH: 5.8, bpH: 6.2, OM: 4.1, P_bray: 12, K: 95, S: 8, Zn: 0.9, Ca: 1420, Mg: 245, Na: 35, CEC: 22.1, Nitrate: 6, Ammonium: 3, EC: 0.38 },
    pathogens: createHistoricalData([
      { name: 'Pythium spp.', pct: 68, impact: 'high', targetCrop: 'Corn' },
      { name: 'Fusarium graminearum', pct: 52, impact: 'medium', targetCrop: 'Corn' },
      { name: 'Western Corn Rootworm', pct: 25, impact: 'low', targetCrop: 'Corn' },
      { name: 'Rhizoctonia solani', pct: 22, impact: 'low', targetCrop: 'Corn' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 15, impact: 'low', targetCrop: 'Corn' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'above_avg', P_solubilization: 'below_avg' }
  },
  homeQuarter: {
    id: 'homeQuarter', growerId: 'henderson', name: 'Home Quarter', acres: 160, crop: 'Corn',
    previousCrop: 'Soybean', region: 'Story County, IA', sampledOn: '2026-03-15',
    chemistry: { pH: 7.2, bpH: 7.0, OM: 2.1, P_bray: 35, K: 210, S: 18, Zn: 1.8, Ca: 2400, Mg: 410, Na: 38, CEC: 15.8, Nitrate: 14, Ammonium: 6, EC: 0.51 },
    pathogens: createHistoricalData([
      { name: 'Fusarium graminearum', pct: 35, impact: 'low', targetCrop: 'Corn' },
      { name: 'Pythium spp.', pct: 28, impact: 'low', targetCrop: 'Corn' },
      { name: 'Western Corn Rootworm', pct: 22, impact: 'low', targetCrop: 'Corn' },
      { name: 'Rhizoctonia solani', pct: 18, impact: 'low', targetCrop: 'Corn' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 12, impact: 'low', targetCrop: 'Corn' },
    ], 'stable'),
    nutrientCycling: { N_mineralization: 'average', P_solubilization: 'average' }
  },
  eastCreek: {
    id: 'eastCreek', growerId: 'martinez', name: 'East Creek', acres: 95, crop: 'Corn',
    previousCrop: 'Soybean', region: 'Story County, IA', sampledOn: '2026-03-14',
    chemistry: { pH: 6.6, bpH: 6.9, OM: 3.5, P_bray: 22, K: 160, S: 14, Zn: 1.4, Ca: 1980, Mg: 340, Na: 42, CEC: 19.0, Nitrate: 10, Ammonium: 5, EC: 0.45 },
    pathogens: createHistoricalData([
      { name: 'Western Corn Rootworm', pct: 78, impact: 'high', targetCrop: 'Corn' },
      { name: 'Fusarium graminearum', pct: 48, impact: 'medium', targetCrop: 'Corn' },
      { name: 'Pythium spp.', pct: 35, impact: 'low', targetCrop: 'Corn' },
      { name: 'Rhizoctonia solani', pct: 24, impact: 'low', targetCrop: 'Corn' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'average', P_solubilization: 'average' }
  },
  southPivot: {
    id: 'southPivot', growerId: 'martinez', name: 'South Pivot', acres: 140, crop: 'Soybean',
    previousCrop: 'Corn', region: 'Story County, IA', sampledOn: '2026-03-14',
    chemistry: { pH: 6.2, bpH: 6.5, OM: 2.8, P_bray: 16, K: 130, S: 10, Zn: 1.1, Ca: 1720, Mg: 290, Na: 40, CEC: 17.5, Nitrate: 7, Ammonium: 3, EC: 0.40 },
    pathogens: createHistoricalData([
      { name: 'Soybean Cyst Nematode (H. glycines)', pct: 62, impact: 'medium', targetCrop: 'Soybean' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 44, impact: 'medium', targetCrop: 'Soybean' },
      { name: 'Pythium spp.', pct: 32, impact: 'low', targetCrop: 'Soybean' },
      { name: 'Rhizoctonia solani', pct: 28, impact: 'low', targetCrop: 'Soybean' },
    ], 'stable'),
    nutrientCycling: { N_mineralization: 'average', P_solubilization: 'average' }
  },
  wrightWest: {
    id: 'wrightWest', growerId: 'wright', name: 'Wright West 80', acres: 80, crop: 'Soybean',
    previousCrop: 'Corn', region: 'Marshall County, IA', sampledOn: '2026-03-12',
    chemistry: { pH: 6.5, bpH: 6.8, OM: 3.8, P_bray: 24, K: 175, S: 15, Zn: 1.5, Ca: 2050, Mg: 355, Na: 44, CEC: 19.8, Nitrate: 9, Ammonium: 4, EC: 0.44 },
    pathogens: createHistoricalData([
      { name: 'Soybean Cyst Nematode (H. glycines)', pct: 91, impact: 'high', targetCrop: 'Soybean' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 75, impact: 'high', targetCrop: 'Soybean' },
      { name: 'White Mold (S. sclerotiorum)', pct: 68, impact: 'high', targetCrop: 'Soybean' },
      { name: 'Fusarium spp.', pct: 42, impact: 'medium', targetCrop: 'Soybean' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'below_avg', P_solubilization: 'average' }
  },
  wrightEast: {
    id: 'wrightEast', growerId: 'wright', name: 'Wright East 160', acres: 160, crop: 'Corn',
    previousCrop: 'Soybean', region: 'Marshall County, IA', sampledOn: '2026-03-12',
    chemistry: { pH: 6.8, bpH: 7.0, OM: 3.6, P_bray: 28, K: 190, S: 16, Zn: 1.6, Ca: 2200, Mg: 380, Na: 46, CEC: 20.1, Nitrate: 12, Ammonium: 5, EC: 0.47 },
    pathogens: createHistoricalData([
      { name: 'Fusarium graminearum', pct: 38, impact: 'low', targetCrop: 'Corn' },
      { name: 'Pythium spp.', pct: 30, impact: 'low', targetCrop: 'Corn' },
      { name: 'Western Corn Rootworm', pct: 26, impact: 'low', targetCrop: 'Corn' },
    ], 'falling'),
    nutrientCycling: { N_mineralization: 'above_avg', P_solubilization: 'average' }
  },
  oconnellNorth: {
    id: 'oconnellNorth', growerId: 'oconnell', name: "O'Connell North", acres: 110, crop: 'Corn',
    previousCrop: 'Soybean', region: 'Hardin County, IA', sampledOn: '2026-03-16',
    chemistry: { pH: 5.9, bpH: 6.3, OM: 3.2, P_bray: 11, K: 105, S: 9, Zn: 1.0, Ca: 1580, Mg: 270, Na: 38, CEC: 18.5, Nitrate: 5, Ammonium: 3, EC: 0.36 },
    pathogens: createHistoricalData([
      { name: 'Pythium spp.', pct: 82, impact: 'high', targetCrop: 'Corn' },
      { name: 'Fusarium graminearum', pct: 58, impact: 'medium', targetCrop: 'Corn' },
      { name: 'Rhizoctonia solani', pct: 45, impact: 'medium', targetCrop: 'Corn' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'below_avg', P_solubilization: 'below_avg' }
  },
  patelMain: {
    id: 'patelMain', growerId: 'patel', name: 'Patel Main 200', acres: 200, crop: 'Soybean',
    previousCrop: 'Corn', region: 'Linn County, IA', sampledOn: '2026-03-11',
    chemistry: { pH: 6.7, bpH: 6.9, OM: 3.4, P_bray: 20, K: 155, S: 13, Zn: 1.3, Ca: 1920, Mg: 330, Na: 43, CEC: 18.8, Nitrate: 8, Ammonium: 4, EC: 0.43 },
    pathogens: createHistoricalData([
      { name: 'Soybean Cyst Nematode (H. glycines)', pct: 48, impact: 'medium', targetCrop: 'Soybean' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 35, impact: 'low', targetCrop: 'Soybean' },
      { name: 'Pythium spp.', pct: 28, impact: 'low', targetCrop: 'Soybean' },
    ], 'stable'),
    nutrientCycling: { N_mineralization: 'average', P_solubilization: 'average' }
  },
  johanssenUpper: {
    id: 'johanssenUpper', growerId: 'johanssen', name: 'Johanssen Upper', acres: 180, crop: 'Corn',
    previousCrop: 'Corn', region: 'Story County, IA', sampledOn: '2026-03-13',
    chemistry: { pH: 7.0, bpH: 7.0, OM: 2.4, P_bray: 32, K: 195, S: 17, Zn: 1.7, Ca: 2300, Mg: 395, Na: 45, CEC: 16.2, Nitrate: 13, Ammonium: 5, EC: 0.49 },
    pathogens: createHistoricalData([
      { name: 'Western Corn Rootworm', pct: 88, impact: 'high', targetCrop: 'Corn' },
      { name: 'Fusarium graminearum', pct: 54, impact: 'medium', targetCrop: 'Corn' },
      { name: 'Pythium spp.', pct: 32, impact: 'low', targetCrop: 'Corn' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'average', P_solubilization: 'average' }
  },
  bakerRidge: {
    id: 'bakerRidge', growerId: 'baker', name: 'Baker Ridge', acres: 240, crop: 'Soybean',
    previousCrop: 'Corn', region: 'Boone County, IA', sampledOn: '2026-03-10',
    chemistry: { pH: 6.3, bpH: 6.6, OM: 3.1, P_bray: 19, K: 140, S: 11, Zn: 1.2, Ca: 1810, Mg: 315, Na: 42, CEC: 18.0, Nitrate: 7, Ammonium: 4, EC: 0.41 },
    pathogens: createHistoricalData([
      { name: 'Soybean Cyst Nematode (H. glycines)', pct: 74, impact: 'high', targetCrop: 'Soybean' },
      { name: 'Sudden Death Syndrome (F. virguliforme)', pct: 52, impact: 'medium', targetCrop: 'Soybean' },
      { name: 'Pythium spp.', pct: 30, impact: 'low', targetCrop: 'Soybean' },
    ], 'rising'),
    nutrientCycling: { N_mineralization: 'below_avg', P_solubilization: 'average' }
  },
  tranSouth: {
    id: 'tranSouth', growerId: 'tran', name: 'Tran South 40', acres: 40, crop: 'Corn',
    previousCrop: 'Soybean', region: 'Poweshiek County, IA', sampledOn: '2026-03-17',
    chemistry: { pH: 6.8, bpH: 7.0, OM: 2.9, P_bray: 26, K: 170, S: 15, Zn: 1.4, Ca: 2100, Mg: 360, Na: 44, CEC: 17.8, Nitrate: 11, Ammonium: 5, EC: 0.46 },
    pathogens: createHistoricalData([
      { name: 'Fusarium graminearum', pct: 32, impact: 'low', targetCrop: 'Corn' },
      { name: 'Pythium spp.', pct: 25, impact: 'low', targetCrop: 'Corn' },
      { name: 'Western Corn Rootworm', pct: 20, impact: 'low', targetCrop: 'Corn' },
    ], 'stable'),
    nutrientCycling: { N_mineralization: 'average', P_solubilization: 'average' }
  },
};

// =====================================================================
// RECOMMENDATION ENGINE
// =====================================================================

const SCIENTIFIC_RESOURCES = {
  'SCN': [
    { title: 'Soybean Cyst Nematode Management Guide', source: 'Iowa State Extension', url: 'https://crops.extension.iastate.edu/encyclopedia/soybean-cyst-nematode' },
    { title: 'Effectiveness of PI 88788 and Peking Resistance Sources', source: 'Plant Disease Journal (2023)', url: '#' },
    { title: 'ILeVO Seed Treatment Efficacy Data', source: 'BASF Technical Bulletin', url: '#' },
  ],
  'SDS': [
    { title: 'Sudden Death Syndrome Field Guide', source: 'Crop Protection Network', url: 'https://cropprotectionnetwork.org/publications/sudden-death-syndrome-of-soybean' },
    { title: 'Saltro vs ILeVO: Comparative Field Trials', source: 'Syngenta Agronomy (2024)', url: '#' },
  ],
  'Pythium': [
    { title: 'Pythium Management in Corn and Soybean', source: 'University of Illinois Extension', url: 'https://extension.illinois.edu/fcm/pythium-root-rot' },
    { title: 'Metalaxyl Seed Treatment Application Rates', source: 'Corteva Product Label', url: '#' },
  ],
  'Lime': [
    { title: 'Soil pH Management and Lime Application', source: 'Iowa State Extension PM-1688', url: 'https://store.extension.iastate.edu/product/pm1688' },
  ],
  'Phosphorus': [
    { title: 'Phosphorus Management for Iowa Soils', source: 'Iowa State Extension', url: 'https://crops.extension.iastate.edu/encyclopedia/phosphorus-management' },
    { title: 'Biological P-Liberation: Pivot Bio Results', source: 'Field Trial Data (2023)', url: '#' },
  ],
  'Potassium': [
    { title: 'Potassium Management Best Practices', source: 'International Plant Nutrition Institute', url: '#' },
  ],
  'CornRootworm': [
    { title: 'Western Corn Rootworm Management', source: 'University of Nebraska-Lincoln', url: 'https://cropwatch.unl.edu/insects/corn-rootworm' },
    { title: 'Bt Trait Rotation Strategies', source: 'Entomology Today (2024)', url: '#' },
  ],
  'Default': [
    { title: 'TraceCOMPLETE Technical Documentation', source: 'Miraterra Soil Science', url: 'https://miraterrasoil.com/technology' },
  ]
};

function generateRecommendations(field) {
  const recs = [];
  const c = field.chemistry;
  const highPathogens = field.pathogens.filter(p => p.pct >= 70);
  const mediumPathogens = field.pathogens.filter(p => p.pct >= 50 && p.pct < 70);

  highPathogens.forEach(p => {
    if (p.name.includes('Cyst Nematode')) {
      recs.push({
        id: `${field.id}-scn`, priority: 'critical', category: 'Seed Selection',
        title: `Switch to SCN-resistant variety`,
        rationale: `SCN at ${p.pct}th percentile regionally. Untreated, yield drag compounds annually — trend data shows pressure climbed ${p.pct - p.history[0].pct} points over 3 seasons.`,
        action: `Select Peking or PI 88788 source of resistance. Pair with ILeVO or Saltro seed treatment.`,
        valuePerAcre: 105, totalValue: 105 * field.acres,
        confidence: 'high', citedProduct: 'TraceCOMPLETE Seed Solution Guide',
        resources: SCIENTIFIC_RESOURCES.SCN
      });
    }
    if (p.name.includes('Sudden Death')) {
      recs.push({
        id: `${field.id}-sds`, priority: 'critical', category: 'Seed Treatment',
        title: `Apply ILeVO or Saltro seed treatment`,
        rationale: `SDS pressure at ${p.pct}th percentile. Curative options limited in-season.`,
        action: `Target affected acres only. Skip where SDS <40th percentile.`,
        valuePerAcre: 85, totalValue: 85 * field.acres,
        confidence: 'high', citedProduct: 'TraceCOMPLETE Seed Solution Guide',
        resources: SCIENTIFIC_RESOURCES.SDS
      });
    }
    if (p.name.includes('Pythium')) {
      recs.push({
        id: `${field.id}-pyth`, priority: 'high', category: 'Seed Treatment',
        title: `Metalaxyl-based fungicide seed treatment`,
        rationale: `Pythium at ${p.pct}th percentile. Cool/wet early-season conditions will amplify risk.`,
        action: `Use Apron or equivalent metalaxyl treatment at label rate.`,
        valuePerAcre: 85, totalValue: 85 * field.acres,
        confidence: 'high', citedProduct: 'TraceCOMPLETE Seed Solution Guide',
        resources: SCIENTIFIC_RESOURCES.Pythium
      });
    }
    if (p.name.includes('White Mold')) {
      recs.push({
        id: `${field.id}-wm`, priority: 'high', category: 'In-Season',
        title: `Plan R1 fungicide application for white mold`,
        rationale: `White mold (Sclerotinia) at ${p.pct}th percentile. Canopy closure risk high with dense varieties.`,
        action: `Schedule Endura or Aproach Prima at R1-R2. Consider row spacing ≥30".`,
        valuePerAcre: null, totalValue: null,
        confidence: 'high', citedProduct: 'TraceCOMPLETE',
        resources: SCIENTIFIC_RESOURCES.Default
      });
    }
    if (p.name.includes('Rootworm')) {
      recs.push({
        id: `${field.id}-cr`, priority: 'critical', category: 'Seed Selection',
        title: `Rotate to non-corn or deploy pyramid Bt traits`,
        rationale: `Western Corn Rootworm at ${p.pct}th percentile. Continuous corn compounds resistance risk.`,
        action: `Either rotate to soybean, or plant SmartStax PRO / Duracade trait stack.`,
        valuePerAcre: 105, totalValue: 105 * field.acres,
        confidence: 'high', citedProduct: 'TraceCOMPLETE Seed Solution Guide',
        resources: SCIENTIFIC_RESOURCES.CornRootworm
      });
    }
  });

  if (c.pH < 6.0) {
    recs.push({
      id: `${field.id}-lime`, priority: 'high', category: 'Soil Amendment',
      title: `Apply agricultural lime`,
      rationale: `pH ${c.pH} is below optimal (6.2-6.8). Buffer pH of ${c.bpH} suggests moderate lime demand.`,
      action: `Apply 2-3 tons/acre ag lime this fall. Retest in 12 months.`,
      valuePerAcre: null, totalValue: null,
      confidence: 'high', citedProduct: 'TraceCHEM',
      resources: SCIENTIFIC_RESOURCES.Lime
    });
  }

  if (c.P_bray < 15) {
    const cycling = field.nutrientCycling.P_solubilization;
    recs.push({
      id: `${field.id}-p`, priority: 'high', category: 'Phosphorus',
      title: cycling === 'below_avg'
        ? `Build soil P with MAP + phosphorus-liberating biological`
        : `Build soil P with standard MAP application`,
      rationale: `Bray P at ${c.P_bray} ppm (deficient <15). P solubilization indicators: ${cycling.replace('_', ' ')}.`,
      action: cycling === 'below_avg'
        ? `Apply MAP at 150 lb/acre + biofertilizer (e.g., Envita or Pivot Bio).`
        : `Apply MAP at 100 lb/acre.`,
      valuePerAcre: null, totalValue: null,
      confidence: 'medium', citedProduct: 'TracePHOS',
      resources: SCIENTIFIC_RESOURCES.Phosphorus
    });
  }

  if (c.K < 120) {
    recs.push({
      id: `${field.id}-k`, priority: 'medium', category: 'Potassium',
      title: `Supplement potassium`,
      rationale: `K at ${c.K} ppm (deficient <120). Critical for pod fill and stalk strength.`,
      action: `Apply potash at 80-100 lb K2O/acre pre-plant.`,
      valuePerAcre: null, totalValue: null,
      confidence: 'high', citedProduct: 'TraceCHEM',
      resources: SCIENTIFIC_RESOURCES.Potassium
    });
  }

  if (mediumPathogens.length > 0 && recs.length > 0) {
    recs.push({
      id: `${field.id}-scout`, priority: 'monitor', category: 'In-Season',
      title: `Scout for ${mediumPathogens.map(p => p.name.split('(')[0].trim()).slice(0, 2).join(', ')}`,
      rationale: `Moderate pathogen pressure (50-69th percentile). Worth field-walks at V3-V5.`,
      action: `Flag for agronomist visit week of June 15. Re-test next fall if yield anomalies appear.`,
      valuePerAcre: null, totalValue: null,
      confidence: 'medium', citedProduct: 'TraceVIEW',
      resources: SCIENTIFIC_RESOURCES.Default
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: `${field.id}-std`, priority: 'low', category: 'Standard Program',
      title: `No changes recommended`,
      rationale: `All pathogens below 40th percentile. Chemistry within optimal ranges.`,
      action: `Continue current seed and fertility program. Re-sample next fall.`,
      valuePerAcre: null, totalValue: null,
      confidence: 'high', citedProduct: 'TraceCOMPLETE',
      resources: SCIENTIFIC_RESOURCES.Default
    });
  }

  return recs;
}

// Aggregate portfolio data
function calculatePortfolioMetrics() {
  const allFields = Object.values(SAMPLE_FIELDS);
  const growerMetrics = GROWERS.map(grower => {
    const fields = allFields.filter(f => f.growerId === grower.id);
    const criticalFields = fields.filter(f => f.pathogens.some(p => p.pct >= 70)).length;
    const totalUplift = fields.reduce((sum, f) => {
      const recs = generateRecommendations(f);
      return sum + recs.filter(r => r.totalValue).reduce((s, r) => s + r.totalValue, 0);
    }, 0);
    const acresSampled = fields.reduce((sum, f) => sum + f.acres, 0);
    return { ...grower, fields, criticalFields, totalUplift, acresSampled, fieldCount: fields.length };
  });

  return {
    growers: growerMetrics.sort((a, b) => b.totalUplift - a.totalUplift),
    totalUplift: growerMetrics.reduce((sum, g) => sum + g.totalUplift, 0),
    totalFields: allFields.length,
    criticalFields: allFields.filter(f => f.pathogens.some(p => p.pct >= 70)).length,
    totalAcres: allFields.reduce((sum, f) => sum + f.acres, 0),
  };
}

// =====================================================================
// SHARED STYLES / FONTS
// =====================================================================

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
    .font-sans { font-family: 'IBM Plex Sans', -apple-system, sans-serif; }
    .font-serif { font-family: 'Fraunces', Georgia, serif; font-variation-settings: 'opsz' 72; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
    .signature-font { font-family: 'Fraunces', cursive; font-style: italic; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// =====================================================================
// LOGIN PAGE
// =====================================================================

function LoginPage({ onLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!firstName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onLogin({
        firstName: firstName.trim(),
        lastName: lastName.trim() || 'Smith',
        email: `${firstName.toLowerCase()}.${(lastName || 'smith').toLowerCase()}@traceadvisor.com`,
        credential: 'Certified Crop Advisor (CCA)',
        region: 'Central Iowa',
        accounts: GROWERS.length,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center p-6 font-sans">
      <GlobalStyles />
      <div className="w-full max-w-[980px] grid grid-cols-1 lg:grid-cols-2 border border-[#2b2a26] bg-white overflow-hidden">
        {/* Left — visual panel */}
        <div className="bg-[#2b2a26] p-10 lg:p-14 text-[#faf7f0] flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-[#c8893f] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-[#2b2a26]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] text-[#c8893f] font-semibold uppercase">Trace by Miraterra</div>
                <div className="text-xl font-serif leading-none mt-0.5">Advisor<span className="text-[#c8893f]">.</span></div>
              </div>
            </div>
            <h1 className="font-serif text-[40px] leading-[1] tracking-tight mb-4">
              The decision layer<br />for <em className="text-[#c8893f] not-italic" style={{ fontStyle: 'italic' }}>serious</em><br />agronomists.
            </h1>
            <p className="text-[13px] text-[#e8e3d8] leading-relaxed max-w-sm mt-6">
              Manage your entire book of grower accounts. Turn TraceCOMPLETE data into revenue. Close the loop with the people who matter.
            </p>
          </div>
          <div className="relative z-10 pt-10 border-t border-[#4a4840] flex items-baseline justify-between text-[10px] tracking-[0.15em] uppercase text-[#8a8560]">
            <span>Trusted by 2,400+ CCAs</span>
            <span className="font-mono">v2.0</span>
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #faf7f0 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}/>
        </div>

        {/* Right — login form */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-2">
            Sign in to your workspace
          </div>
          <h2 className="font-serif text-[32px] text-[#2b2a26] tracking-tight mb-8 leading-tight">
            Welcome back.
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#6b6758] font-semibold uppercase mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Soph"
                className="w-full bg-[#f5f1e8] border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none px-4 py-3 text-[14px] text-[#2b2a26] font-mono"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#6b6758] font-semibold uppercase mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Ren"
                className="w-full bg-[#f5f1e8] border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none px-4 py-3 text-[14px] text-[#2b2a26] font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-[#6b6758] font-semibold uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full bg-[#f5f1e8] border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none px-4 py-3 text-[14px] text-[#2b2a26] font-mono"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!firstName.trim() || loading}
              className="w-full bg-[#2b2a26] text-[#faf7f0] hover:bg-[#4a4840] disabled:bg-[#8a8560] disabled:cursor-not-allowed px-4 py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in</>
              ) : (
                <>Sign in <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#e8e3d8] text-[11px] text-[#6b6758] leading-relaxed">
            Trouble signing in? Contact <span className="font-mono text-[#2b2a26]">support@miraterrasoil.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// TOP NAV
// =====================================================================

function TopNav({ user, currentView, onNavigate, onLogout }) {
  return (
    <header className="border-b border-[#2b2a26] bg-[#faf7f0] sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button onClick={() => onNavigate('portfolio')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#2b2a26] flex items-center justify-center group-hover:bg-[#4a4840] transition-colors">
              <Sprout className="w-5 h-5 text-[#faf7f0]" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase">Trace by Miraterra</div>
              <div className="text-lg font-serif text-[#2b2a26] leading-none mt-0.5">Advisor<span className="text-[#c8893f]">.</span></div>
            </div>
          </button>
          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.15em] uppercase">
            <button
              onClick={() => onNavigate('portfolio')}
              className={`transition-colors font-semibold ${currentView === 'portfolio' ? 'text-[#2b2a26] border-b-2 border-[#c8893f] pb-5 -mb-5' : 'text-[#6b6758] hover:text-[#2b2a26]'}`}
            >
              Portfolio
            </button>
            <button
              onClick={() => onNavigate('growers')}
              className={`transition-colors font-semibold ${currentView === 'growers' ? 'text-[#2b2a26] border-b-2 border-[#c8893f] pb-5 -mb-5' : 'text-[#6b6758] hover:text-[#2b2a26]'}`}
            >
              Growers
            </button>
            <button
              onClick={() => onNavigate('library')}
              className={`transition-colors font-semibold ${currentView === 'library' ? 'text-[#2b2a26] border-b-2 border-[#c8893f] pb-5 -mb-5' : 'text-[#6b6758] hover:text-[#2b2a26]'}`}
            >
              Library
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-[#6b6758] hover:text-[#2b2a26] transition-colors"><Search className="w-4 h-4" strokeWidth={1.5} /></button>
          <button className="text-[#6b6758] hover:text-[#2b2a26] transition-colors relative">
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#b8442f] rounded-full" />
          </button>
          <div className="h-6 w-px bg-[#e8e3d8]" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8893f] text-white flex items-center justify-center text-[11px] font-semibold font-mono">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="hidden lg:block">
              <div className="text-[12px] text-[#2b2a26] font-semibold leading-none">{user.firstName} {user.lastName}</div>
              <div className="text-[9px] text-[#6b6758] tracking-wide mt-0.5 uppercase">{user.credential}</div>
            </div>
            <button onClick={onLogout} className="text-[#6b6758] hover:text-[#b8442f] transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// PORTFOLIO VIEW
// =====================================================================

function PortfolioView({ user, onSelectField, onSelectGrower }) {
  const metrics = useMemo(() => calculatePortfolioMetrics(), []);

  const triageQueue = useMemo(() => {
    return Object.values(SAMPLE_FIELDS)
      .map(f => {
        const criticalCount = f.pathogens.filter(p => p.pct >= 70).length;
        const maxPct = Math.max(...f.pathogens.map(p => p.pct));
        const grower = GROWERS.find(g => g.id === f.growerId);
        return { ...f, criticalCount, maxPct, grower };
      })
      .filter(f => f.criticalCount > 0)
      .sort((a, b) => b.maxPct - a.maxPct)
      .slice(0, 6);
  }, []);

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      {/* Hero */}
      <section className="mb-10 max-w-4xl">
        <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-3">
          Portfolio · Spring 2026
        </div>
        <h1 className="font-serif text-[44px] md:text-[56px] leading-[0.95] text-[#2b2a26] tracking-tight mb-4">
          Hello, <em className="text-[#c8893f] not-italic" style={{ fontStyle: 'italic' }}>{user.firstName}</em>.
        </h1>
        <p className="text-[15px] text-[#4a4840] leading-relaxed max-w-2xl">
          {triageQueue.length} fields across {new Set(triageQueue.map(f => f.growerId)).size} growers need your attention this week.
          Start with the highest-dollar opportunities below.
        </p>
      </section>

      {/* Portfolio metrics */}
      <section className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#2b2a26] bg-white">
        <div className="p-5 border-r border-[#2b2a26]">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3 h-3 text-[#6b6758]" strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Growers</span>
          </div>
          <div className="font-mono text-2xl tabular-nums text-[#2b2a26] font-medium">{metrics.growers.length}</div>
          <div className="text-[10px] text-[#6b6758] mt-0.5">{metrics.totalAcres.toLocaleString()} ac sampled</div>
        </div>
        <div className="p-5 border-r-0 md:border-r border-[#2b2a26]">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="w-3 h-3 text-[#6b6758]" strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Fields analyzed</span>
          </div>
          <div className="font-mono text-2xl tabular-nums text-[#2b2a26] font-medium">{metrics.totalFields}</div>
          <div className="text-[10px] text-[#6b6758] mt-0.5">this season</div>
        </div>
        <div className="p-5 border-r border-[#2b2a26] border-t md:border-t-0">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3 h-3 text-[#b8442f]" strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Critical fields</span>
          </div>
          <div className="font-mono text-2xl tabular-nums text-[#b8442f] font-medium">{metrics.criticalFields}</div>
          <div className="text-[10px] text-[#6b6758] mt-0.5">need action now</div>
        </div>
        <div className="p-5 border-t md:border-t-0 bg-[#2b2a26] text-[#faf7f0]">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3 h-3 text-[#c8893f]" strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.15em] text-[#c8893f] font-semibold uppercase">Portfolio uplift</span>
          </div>
          <div className="font-mono text-2xl tabular-nums text-[#c8893f] font-medium">
            ${(metrics.totalUplift / 1000).toFixed(0)}K
          </div>
          <div className="text-[10px] text-[#e8e3d8] mt-0.5">total opportunity</div>
        </div>
      </section>

      {/* Triage + Grower Table layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
        {/* Grower accounts ranked by opportunity */}
        <section>
          <div className="flex items-center gap-2 mb-5 pb-2 border-b-2 border-[#2b2a26]">
            <h2 className="text-[11px] tracking-[0.2em] text-[#2b2a26] font-semibold uppercase">
              Accounts · Ranked by Opportunity
            </h2>
            <span className="text-[9px] text-[#6b6758] font-mono ml-auto">sorted descending</span>
          </div>

          <div className="bg-white border border-[#e8e3d8]">
            <div className="grid grid-cols-[1fr_80px_80px_100px_40px] gap-4 px-5 py-3 border-b border-[#e8e3d8] bg-[#f5f1e8]">
              <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Account</div>
              <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase text-right">Fields</div>
              <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase text-right">Critical</div>
              <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase text-right">Opportunity</div>
              <div />
            </div>
            {metrics.growers.map((g) => {
              const fieldsToShow = g.fields.filter(f => f.pathogens.some(p => p.pct >= 70));
              const firstField = fieldsToShow[0] || g.fields[0];
              return (
                <button
                  key={g.id}
                  onClick={() => firstField && onSelectField(firstField.id)}
                  disabled={!g.fields.length}
                  className="w-full grid grid-cols-[1fr_80px_80px_100px_40px] gap-4 px-5 py-4 border-b border-[#e8e3d8] last:border-b-0 text-left hover:bg-[#f5f1e8] transition-colors disabled:opacity-50"
                >
                  <div>
                    <div className="font-serif text-[17px] text-[#2b2a26] tracking-tight">{g.name}</div>
                    <div className="text-[10px] text-[#6b6758] mt-0.5 tracking-wide">
                      {g.owner} · {g.relationship} · {g.totalAcres.toLocaleString()} ac
                    </div>
                  </div>
                  <div className="text-right self-center">
                    <div className="font-mono text-[14px] tabular-nums text-[#2b2a26]">{g.fieldCount}</div>
                  </div>
                  <div className="text-right self-center">
                    {g.criticalFields > 0 ? (
                      <span className="inline-block bg-[#b8442f] text-white px-2 py-0.5 text-[9px] font-bold tracking-[0.15em]">
                        {g.criticalFields}
                      </span>
                    ) : (
                      <span className="text-[#6b6758] font-mono text-[12px]">—</span>
                    )}
                  </div>
                  <div className="text-right self-center">
                    <div className={`font-mono text-[14px] tabular-nums font-medium ${g.totalUplift > 15000 ? 'text-[#5a7555]' : 'text-[#6b6758]'}`}>
                      ${(g.totalUplift / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <div className="self-center text-[#6b6758]">
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Triage queue */}
        <section>
          <div className="flex items-center gap-2 mb-5 pb-2 border-b-2 border-[#2b2a26]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#b8442f] animate-pulse" />
            <h2 className="text-[11px] tracking-[0.2em] text-[#2b2a26] font-semibold uppercase">
              Triage Queue
            </h2>
            <span className="text-[9px] text-[#6b6758] font-mono ml-auto">this week</span>
          </div>

          <div className="space-y-2">
            {triageQueue.map((f, i) => (
              <button
                key={f.id}
                onClick={() => onSelectField(f.id)}
                className="w-full text-left bg-white border border-[#e8e3d8] hover:border-[#2b2a26] transition-colors p-4 group"
              >
                <div className="flex items-start justify-between mb-1.5 gap-3">
                  <div>
                    <div className="font-serif text-[16px] text-[#2b2a26] tracking-tight leading-tight">{f.name}</div>
                    <div className="text-[10px] text-[#6b6758] mt-0.5 tracking-wide">
                      {f.grower.name} · {f.acres} ac · {f.crop}
                    </div>
                  </div>
                  <span className="inline-block bg-[#b8442f] text-white px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] shrink-0">
                    {f.criticalCount} CRIT
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e8e3d8]">
                  <span className="text-[10px] text-[#6b6758] tracking-wide">
                    Peak: {f.maxPct}th pct
                  </span>
                  <span className="text-[10px] text-[#2b2a26] font-semibold tracking-[0.15em] uppercase group-hover:text-[#c8893f] transition-colors flex items-center gap-1">
                    Review <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// =====================================================================
// FIELD DETAIL VIEW COMPONENTS
// =====================================================================

const HistoricalPathogenBar = ({ pathogen, selectedYear }) => {
  const yearData = pathogen.history.find(h => h.year === selectedYear) || pathogen.history[pathogen.history.length - 1];
  const pct = yearData.pct;
  const firstYear = pathogen.history[0].pct;
  const trend = pct - firstYear;
  const trendIcon = trend > 10 ? <TrendingUp className="w-3 h-3 text-[#b8442f]" /> : trend < -10 ? <TrendingDown className="w-3 h-3 text-[#5a7555]" /> : <Minus className="w-3 h-3 text-[#6b6758]" />;

  const getColor = () => {
    if (pct >= 70) return 'bg-[#b8442f]';
    if (pct >= 50) return 'bg-[#c8893f]';
    if (pct >= 30) return 'bg-[#8a8560]';
    return 'bg-[#5a7555]';
  };
  const getLabel = () => {
    if (pct >= 70) return 'HIGH PRESSURE';
    if (pct >= 50) return 'ELEVATED';
    if (pct >= 30) return 'BASELINE';
    return 'LOW';
  };

  return (
    <div className="py-3 border-b border-[#e8e3d8] last:border-b-0">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <span className="text-[13px] text-[#2b2a26] font-medium tracking-tight">{pathogen.name}</span>
        <div className="flex items-center gap-2">
          {trendIcon}
          <span className="text-[11px] text-[#6b6758] font-mono tabular-nums whitespace-nowrap">{pct}th pct</span>
        </div>
      </div>
      <div className="relative h-1.5 bg-[#e8e3d8] rounded-none overflow-hidden">
        <div className={`absolute left-0 top-0 h-full ${getColor()} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
        <div className="absolute left-[70%] top-0 h-full w-px bg-[#2b2a26] opacity-30" />
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        {pathogen.history.map((h, i) => (
          <div key={h.year} className="flex items-center gap-1">
            <span className={`text-[9px] font-mono tabular-nums ${h.year === selectedYear ? 'text-[#2b2a26] font-semibold' : 'text-[#8a8560]'}`}>
              '{h.year.toString().slice(2)}: {h.pct}
            </span>
            {i < pathogen.history.length - 1 && <span className="text-[#8a8560] text-[8px]">→</span>}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={`text-[9px] font-semibold tracking-[0.1em] ${pct >= 70 ? 'text-[#b8442f]' : pct >= 50 ? 'text-[#c8893f]' : 'text-[#6b6758]'}`}>
          {getLabel()}
        </span>
        <span className="text-[9px] text-[#6b6758] tracking-wide">
          {trend > 0 ? `+${trend} pts since '23` : trend < 0 ? `${trend} pts since '23` : 'stable'}
        </span>
      </div>
    </div>
  );
};

const ChemistryTile = ({ label, value, unit, status }) => {
  const getStatusColor = () => {
    if (status === 'deficient') return 'text-[#b8442f]';
    if (status === 'low') return 'text-[#c8893f]';
    if (status === 'optimal') return 'text-[#5a7555]';
    return 'text-[#2b2a26]';
  };
  return (
    <div className="py-3 px-3.5 bg-[#f5f1e8] border-l-2 border-[#2b2a26]">
      <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-mono tabular-nums font-medium ${getStatusColor()}`}>{value}</span>
        <span className="text-[10px] text-[#6b6758] font-mono">{unit}</span>
      </div>
    </div>
  );
};

const RecommendationCard = ({ rec, selected, onToggleSelect, onShowResources }) => {
  const priorityStyles = {
    critical: { bg: 'bg-[#b8442f]', text: 'text-white', label: 'CRITICAL' },
    high: { bg: 'bg-[#c8893f]', text: 'text-white', label: 'HIGH' },
    medium: { bg: 'bg-[#8a8560]', text: 'text-white', label: 'MEDIUM' },
    monitor: { bg: 'bg-[#2b2a26]', text: 'text-[#f5f1e8]', label: 'MONITOR' },
    low: { bg: 'bg-[#5a7555]', text: 'text-white', label: 'ROUTINE' },
  };
  const style = priorityStyles[rec.priority] || priorityStyles.medium;

  return (
    <div className={`bg-white border transition-all duration-200 ${selected ? 'border-[#c8893f] border-2 shadow-[0_0_0_2px_rgba(200,137,63,0.1)]' : 'border-[#e8e3d8] hover:border-[#2b2a26]'}`}>
      <div className="flex items-stretch">
        <div className={`${style.bg} ${style.text} px-3 py-4 flex items-center`}>
          <span className="text-[9px] font-bold tracking-[0.2em]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            {style.label}
          </span>
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-baseline justify-between mb-2 gap-4">
            <div>
              <div className="text-[10px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase mb-1">
                {rec.category}
              </div>
              <h3 className="text-[17px] leading-snug font-serif text-[#2b2a26] tracking-tight">
                {rec.title}
              </h3>
            </div>
            {rec.totalValue && (
              <div className="text-right shrink-0">
                <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Est. Uplift</div>
                <div className="text-lg font-mono tabular-nums text-[#5a7555] font-medium">
                  ${rec.totalValue.toLocaleString()}
                </div>
                <div className="text-[9px] text-[#6b6758] font-mono">${rec.valuePerAcre}/ac</div>
              </div>
            )}
          </div>

          <p className="text-[13px] text-[#4a4840] leading-relaxed mb-3">{rec.rationale}</p>

          <div className="bg-[#f5f1e8] border-l-2 border-[#2b2a26] px-3 py-2 mb-3">
            <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase mb-0.5">Action</div>
            <p className="text-[13px] text-[#2b2a26] leading-snug">{rec.action}</p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#e8e3d8]">
            <div className="flex items-center gap-3 text-[10px] text-[#6b6758] tracking-wide">
              <span className="font-mono">{rec.citedProduct}</span>
              <span className="flex items-center gap-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${rec.confidence === 'high' ? 'bg-[#5a7555]' : 'bg-[#c8893f]'}`} />
                {rec.confidence === 'high' ? 'High conf.' : 'Medium conf.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowResources(rec)}
                className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase font-semibold text-[#6b6758] hover:text-[#2b2a26] transition-colors px-2 py-1 border border-[#e8e3d8] hover:border-[#2b2a26]"
                title="View scientific sources"
              >
                <Globe className="w-3 h-3" strokeWidth={1.5} /> Sources
              </button>
              <button
                onClick={() => onToggleSelect(rec.id)}
                className={`flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase font-semibold px-3 py-1 transition-colors ${
                  selected
                    ? 'bg-[#c8893f] text-white border border-[#c8893f]'
                    : 'bg-white text-[#2b2a26] border border-[#2b2a26] hover:bg-[#2b2a26] hover:text-white'
                }`}
              >
                {selected ? <><CheckCircle2 className="w-3 h-3" /> Included</> : '+ Include in report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// RESOURCES PANEL (SLIDEOUT)
// =====================================================================

function ResourcesPanel({ rec, onClose }) {
  if (!rec) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-md bg-white border-l border-[#2b2a26] h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#e8e3d8] flex items-start justify-between gap-4">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-1">Scientific Sources</div>
            <h3 className="font-serif text-[22px] text-[#2b2a26] tracking-tight leading-tight">{rec.title}</h3>
          </div>
          <button onClick={onClose} className="text-[#6b6758] hover:text-[#2b2a26] transition-colors shrink-0">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-[12px] text-[#6b6758] mb-6 leading-relaxed">
            Every TraceAdvisor recommendation is backed by peer-reviewed research, extension service guidance, or product-specific field data. Review the sources before you commit.
          </p>
          <div className="space-y-3">
            {rec.resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-[#f5f1e8] border border-[#e8e3d8] hover:border-[#2b2a26] p-4 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="font-serif text-[15px] text-[#2b2a26] tracking-tight leading-tight">{r.title}</div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#6b6758] group-hover:text-[#c8893f] shrink-0 mt-1" strokeWidth={1.5} />
                </div>
                <div className="text-[10px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">{r.source}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// GROWER 1-PAGER MODAL (editable, exports to PDF)
// =====================================================================

function GrowerOnePagerModal({ field, grower, user, selectedRecs, onClose }) {
  const [agronomistNote, setAgronomistNote] = useState(
    `${grower.owner.split(' ')[0]}, I reviewed the ${field.name} soil sample from ${new Date(field.sampledOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}. The biggest opportunity for 2026 is ${selectedRecs[0]?.category.toLowerCase() || 'seed selection'}. Let's talk this week — happy to walk the field together.`
  );
  const [signature, setSignature] = useState(`${user.firstName} ${user.lastName}`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const totalUplift = selectedRecs.filter(r => r.totalValue).reduce((sum, r) => sum + r.totalValue, 0);

  const generatePDF = () => {
    setIsGenerating(true);
    // If jsPDF is already loaded, use it directly
    if (window.jspdf) {
      runPDFGeneration();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = runPDFGeneration;
    script.onerror = () => {
      setIsGenerating(false);
      alert('Could not load PDF library. Check your internet connection.');
    };
    document.body.appendChild(script);
  };

  const runPDFGeneration = () => {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'letter' });
        const margin = 48;
        let y = margin;

        // Palette
        const inkHex = [43, 42, 38];
        const ochreHex = [200, 137, 63];
        const mutedHex = [107, 103, 88];

        // Header
        doc.setFillColor(...inkHex);
        doc.rect(0, 0, 612, 72, 'F');
        doc.setTextColor(250, 247, 240);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('TRACE BY MIRATERRA  ·  ADVISOR', margin, 32);
        doc.setFontSize(20);
        doc.setFont('times', 'italic');
        doc.text(`Your 2026 Field Plan`, margin, 58);
        doc.setTextColor(...ochreHex);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`${grower.name}  ·  ${field.name}  ·  ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 612 - margin, 58, { align: 'right' });

        y = 110;

        // Opportunity headline
        if (totalUplift > 0) {
          doc.setFillColor(245, 241, 232);
          doc.rect(margin, y, 612 - margin * 2, 72, 'F');
          doc.setDrawColor(...ochreHex);
          doc.setLineWidth(2);
          doc.line(margin, y, margin, y + 72);
          doc.setTextColor(...mutedHex);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('YOUR 2026 OPPORTUNITY', margin + 16, y + 22);
          doc.setTextColor(...inkHex);
          doc.setFont('times', 'normal');
          doc.setFontSize(32);
          doc.text(`$${totalUplift.toLocaleString()}`, margin + 16, y + 54);
          doc.setTextColor(...mutedHex);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(`across ${field.acres} acres on ${field.name}`, margin + 200, y + 54);
          y += 96;
        }

        // Note from agronomist
        doc.setTextColor(...mutedHex);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`NOTE FROM ${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`, margin, y);
        y += 14;
        doc.setTextColor(...inkHex);
        doc.setFont('times', 'italic');
        doc.setFontSize(11);
        const noteLines = doc.splitTextToSize(agronomistNote, 612 - margin * 2);
        doc.text(noteLines, margin, y);
        y += noteLines.length * 14 + 20;

        // Recommendations
        doc.setTextColor(...mutedHex);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('WHAT WE\'RE DOING ON THIS FIELD', margin, y);
        y += 6;
        doc.setDrawColor(...inkHex);
        doc.setLineWidth(1);
        doc.line(margin, y, 612 - margin, y);
        y += 18;

        selectedRecs.forEach((rec, idx) => {
          if (y > 680) {
            doc.addPage();
            y = margin;
          }
          // Number
          doc.setTextColor(...ochreHex);
          doc.setFont('times', 'italic');
          doc.setFontSize(22);
          doc.text(`${idx + 1}`, margin, y + 4);

          // Title + details
          doc.setTextColor(...inkHex);
          doc.setFont('times', 'normal');
          doc.setFontSize(13);
          const titleLines = doc.splitTextToSize(rec.title, 612 - margin * 2 - 40);
          doc.text(titleLines, margin + 32, y);
          y += titleLines.length * 15 + 4;

          doc.setTextColor(...mutedHex);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const actionLines = doc.splitTextToSize(rec.action, 612 - margin * 2 - 40);
          doc.text(actionLines, margin + 32, y);
          y += actionLines.length * 12 + 4;

          if (rec.totalValue) {
            doc.setTextColor(90, 117, 85);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(`Estimated uplift: $${rec.totalValue.toLocaleString()}  ·  $${rec.valuePerAcre}/acre`, margin + 32, y);
            y += 14;
          }
          y += 12;
        });

        // Footer w/ signature
        const footerY = 720;
        doc.setDrawColor(...inkHex);
        doc.setLineWidth(1);
        doc.line(margin, footerY, 612 - margin, footerY);
        doc.setTextColor(...mutedHex);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text('YOUR AGRONOMIST', margin, footerY + 16);

        doc.setTextColor(...inkHex);
        doc.setFont('times', 'italic');
        doc.setFontSize(20);
        doc.text(signature, margin, footerY + 44);

        doc.setTextColor(...mutedHex);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`${user.firstName} ${user.lastName}, ${user.credential}`, margin, footerY + 58);
        doc.text(`${user.email}`, margin, footerY + 70);

        doc.setFontSize(7);
        doc.setTextColor(...mutedHex);
        doc.text('Generated by TraceAdvisor  ·  Powered by TraceCOMPLETE', 612 - margin, footerY + 70, { align: 'right' });

        // Save
        doc.save(`${grower.name.replace(/\s+/g, '_')}_${field.name.replace(/\s+/g, '_')}_2026_Plan.pdf`);
        setIsGenerating(false);
        setGenerated(true);
      } catch (e) {
        console.error(e);
        setIsGenerating(false);
        alert('PDF generation failed. Try again.');
      }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[900px] max-h-[90vh] overflow-y-auto border border-[#2b2a26]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-[#2b2a26] text-[#faf7f0] p-5 flex items-center justify-between z-10">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#c8893f] font-semibold uppercase mb-1">Grower 1-Pager · Preview</div>
            <h2 className="font-serif text-[20px] tracking-tight">To {grower.name}</h2>
          </div>
          <button onClick={onClose} className="text-[#c8893f] hover:text-[#faf7f0] transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Editable preview */}
        <div className="p-8 bg-[#faf7f0]">
          <div className="bg-white border border-[#e8e3d8] shadow-sm">
            {/* PDF preview header */}
            <div className="bg-[#2b2a26] text-[#faf7f0] p-6">
              <div className="text-[9px] tracking-[0.25em] text-[#c8893f] font-semibold uppercase mb-2">
                Trace by Miraterra · Advisor
              </div>
              <div className="flex items-end justify-between">
                <h1 className="font-serif text-[28px] italic tracking-tight">Your 2026 Field Plan</h1>
                <div className="text-right">
                  <div className="text-[10px] text-[#c8893f] tracking-wide">{grower.name}</div>
                  <div className="text-[10px] text-[#e8e3d8] tracking-wide">{field.name} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Opportunity */}
              {totalUplift > 0 && (
                <div className="bg-[#f5f1e8] border-l-2 border-[#c8893f] p-5 mb-8">
                  <div className="text-[9px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-2">Your 2026 Opportunity</div>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-[40px] text-[#2b2a26] tracking-tight">${totalUplift.toLocaleString()}</span>
                    <span className="text-[11px] text-[#6b6758]">across {field.acres} acres on {field.name}</span>
                  </div>
                </div>
              )}

              {/* Editable note */}
              <div className="mb-8">
                <div className="text-[9px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-2 flex items-center gap-2">
                  <Edit3 className="w-3 h-3" strokeWidth={1.5} />
                  Note From {user.firstName} (editable)
                </div>
                <textarea
                  value={agronomistNote}
                  onChange={(e) => setAgronomistNote(e.target.value)}
                  rows={4}
                  className="w-full bg-[#fdfbf6] border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none p-4 text-[14px] text-[#2b2a26] font-serif italic leading-relaxed resize-none"
                />
              </div>

              {/* Selected Recommendations */}
              <div className="mb-8">
                <div className="text-[9px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-4 pb-2 border-b border-[#2b2a26]">
                  What We're Doing on This Field
                </div>
                <div className="space-y-5">
                  {selectedRecs.map((rec, i) => (
                    <div key={rec.id} className="flex gap-4">
                      <div className="font-serif italic text-[28px] text-[#c8893f] shrink-0 leading-none w-8">{i + 1}</div>
                      <div className="flex-1">
                        <div className="font-serif text-[17px] text-[#2b2a26] tracking-tight mb-1">{rec.title}</div>
                        <div className="text-[12px] text-[#6b6758] leading-relaxed mb-1">{rec.action}</div>
                        {rec.totalValue && (
                          <div className="text-[11px] text-[#5a7555] font-semibold">
                            Estimated uplift: ${rec.totalValue.toLocaleString()} · ${rec.valuePerAcre}/acre
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable Signature */}
              <div className="pt-6 border-t border-[#2b2a26]">
                <div className="text-[9px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-2 flex items-center gap-2">
                  <PenTool className="w-3 h-3" strokeWidth={1.5} />
                  Your Signature (editable)
                </div>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full bg-[#fdfbf6] border-b-2 border-[#2b2a26] focus:outline-none focus:border-[#c8893f] font-serif italic text-[24px] text-[#2b2a26] py-2 mb-2"
                  style={{ fontStyle: 'italic' }}
                />
                <div className="text-[11px] text-[#6b6758]">{user.firstName} {user.lastName}, {user.credential}</div>
                <div className="text-[11px] text-[#6b6758] font-mono">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#2b2a26] p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[#6b6758]">
            {selectedRecs.length} recommendation{selectedRecs.length !== 1 ? 's' : ''} · {totalUplift > 0 ? `$${totalUplift.toLocaleString()} opportunity` : 'no uplift quantified'}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-white text-[#2b2a26] border border-[#2b2a26] px-4 py-2.5 hover:bg-[#f5f1e8] transition-colors">
              Cancel
            </button>
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#2b2a26] text-[#faf7f0] px-5 py-2.5 hover:bg-[#4a4840] transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isGenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</> : generated ? <><CheckCircle2 className="w-3.5 h-3.5" /> Download again</> : <><Download className="w-3.5 h-3.5" /> Generate PDF</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// TEXT-TO-GROWER MODAL
// =====================================================================

function TextToGrowerModal({ field, grower, user, selectedRecs, onClose }) {
  const topRec = selectedRecs[0] || { title: 'Soil recommendations ready', totalValue: null };
  const defaultMessage = `Hi ${grower.owner.split(' ')[0]}, ${user.firstName} here. Just reviewed the ${field.name} results — ${topRec.title.charAt(0).toLowerCase()}${topRec.title.slice(1)} is the priority.${topRec.totalValue ? ` Estimated $${topRec.totalValue.toLocaleString()} opportunity.` : ''} Sending the full 1-pager now. Free to chat this week?`;
  const [message, setMessage] = useState(defaultMessage);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onClose(); }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[520px] border border-[#2b2a26]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#2b2a26] text-[#faf7f0] p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#c8893f] font-semibold uppercase mb-1">Text Message</div>
            <h2 className="font-serif text-[18px] tracking-tight">To {grower.owner}</h2>
          </div>
          <button onClick={onClose} className="text-[#c8893f] hover:text-[#faf7f0] transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6">
          {/* Contact */}
          <div className="bg-[#f5f1e8] border border-[#e8e3d8] p-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c8893f] text-white flex items-center justify-center font-mono text-[13px] font-semibold shrink-0">
                {grower.owner.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[16px] text-[#2b2a26] tracking-tight">{grower.owner}</div>
                <div className="text-[11px] text-[#6b6758] mt-0.5 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 font-mono"><Phone className="w-3 h-3" strokeWidth={1.5} />{grower.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {!sent ? (
            <>
              <div className="mb-4">
                <label className="block text-[9px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-[#fdfbf6] border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none p-3 text-[13px] text-[#2b2a26] leading-relaxed resize-none"
                />
                <div className="text-[10px] text-[#6b6758] mt-1 font-mono text-right">{message.length}/320 chars</div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button onClick={onClose} className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-white text-[#2b2a26] border border-[#2b2a26] px-4 py-2.5 hover:bg-[#f5f1e8] transition-colors">Cancel</button>
                <button
                  onClick={handleSend}
                  className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#2b2a26] text-[#faf7f0] px-5 py-2.5 hover:bg-[#4a4840] transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Send text
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-[#5a7555] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div className="font-serif text-[22px] text-[#2b2a26] tracking-tight mb-1">Sent to {grower.owner.split(' ')[0]}</div>
              <div className="text-[11px] text-[#6b6758]">Delivered to {grower.phone}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// GROWERS VIEW
// =====================================================================

function GrowersView({ user, onSelectGrower }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrowers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return GROWERS.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.owner.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const totalAcres = GROWERS.reduce((sum, g) => sum + g.totalAcres, 0);

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      <section className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-3">
            Account Directory
          </div>
          <h1 className="font-serif text-[40px] text-[#2b2a26] tracking-tight leading-tight mb-2">
            Growers
          </h1>
          <p className="text-[14px] text-[#4a4840]">Contact list of all your clients · click any row to view their fields</p>
        </div>
        <button className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#2b2a26] text-[#faf7f0] px-4 py-2.5 hover:bg-[#4a4840] transition-colors flex items-center gap-2">
          <Download className="w-3 h-3" strokeWidth={1.5} /> Export CSV
        </button>
      </section>

      <div className="mb-6 relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6758]" strokeWidth={1.5} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search growers..."
          className="w-full bg-white border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none pl-11 pr-4 py-3 text-[13px] text-[#2b2a26]"
        />
      </div>

      <div className="bg-white border border-[#e8e3d8]">
        <div className="grid grid-cols-[1fr_1fr_180px_1fr_80px_80px] gap-4 px-5 py-3 border-b border-[#e8e3d8] bg-[#f5f1e8]">
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Grower</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Owner</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Phone</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Email</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase text-right">Years</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase text-right">Acres</div>
        </div>
        {filteredGrowers.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelectGrower(g.id)}
            className="w-full grid grid-cols-[1fr_1fr_180px_1fr_80px_80px] gap-4 px-5 py-4 border-b border-[#e8e3d8] last:border-b-0 text-left hover:bg-[#f5f1e8] transition-colors items-center"
          >
            <div className="font-serif text-[16px] text-[#2b2a26] tracking-tight">{g.name}</div>
            <div className="text-[12px] text-[#4a4840]">{g.owner}</div>
            <div className="text-[11px] text-[#6b6758] font-mono flex items-center gap-1.5"><Phone className="w-3 h-3" strokeWidth={1.5} />{g.phone}</div>
            <div className="text-[11px] text-[#6b6758] flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 shrink-0" strokeWidth={1.5} /><span className="truncate">{g.email}</span></div>
            <div className="text-[11px] text-[#2b2a26] font-mono tabular-nums text-right">{g.relationship}</div>
            <div className="text-[11px] text-[#2b2a26] font-mono tabular-nums text-right">{g.totalAcres.toLocaleString()}</div>
          </button>
        ))}
        <div className="grid grid-cols-[1fr_1fr_180px_1fr_80px_80px] gap-4 px-5 py-3 border-t border-[#2b2a26] bg-[#f5f1e8]">
          <div className="text-[11px] text-[#6b6758]">{filteredGrowers.length} growers</div>
          <div /><div /><div /><div />
          <div className="text-[11px] text-[#2b2a26] font-mono tabular-nums text-right font-semibold">{totalAcres.toLocaleString()} ac</div>
        </div>
      </div>
    </main>
  );
}

// =====================================================================
// LIBRARY VIEW — mock of signed + downloaded field plan PDFs
// Clicking any doc navigates to that field detail with PDF modal auto-opened
// =====================================================================

const LIBRARY_DOCS = [
  { fieldId: 'oconnellNorth', status: 'signed', generatedOn: 'Mar 18, 2026', signedOn: 'Mar 20', signedBy: "Sean O'Connell" },
  { fieldId: 'north40', status: 'signed', generatedOn: 'Mar 17, 2026', signedOn: 'Mar 18', signedBy: 'Bill Henderson' },
  { fieldId: 'riverBottom', status: 'downloaded', generatedOn: 'Mar 17, 2026', signedOn: null, signedBy: null },
  { fieldId: 'eastCreek', status: 'signed', generatedOn: 'Mar 16, 2026', signedOn: 'Mar 19', signedBy: 'Carlos Martinez' },
  { fieldId: 'johanssenUpper', status: 'signed', generatedOn: 'Mar 15, 2026', signedOn: 'Mar 17', signedBy: 'Erik Johanssen' },
  { fieldId: 'wrightWest', status: 'signed', generatedOn: 'Mar 14, 2026', signedOn: 'Mar 15', signedBy: 'Diane Wright' },
  { fieldId: 'wrightEast', status: 'downloaded', generatedOn: 'Mar 14, 2026', signedOn: null, signedBy: null },
  { fieldId: 'patelMain', status: 'downloaded', generatedOn: 'Mar 13, 2026', signedOn: null, signedBy: null },
  { fieldId: 'bakerRidge', status: 'signed', generatedOn: 'Mar 11, 2026', signedOn: 'Mar 13', signedBy: 'Tom Baker' },
];

function LibraryView({ onOpenLibraryDoc }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const docs = useMemo(() => {
    return LIBRARY_DOCS
      .map(d => {
        const field = SAMPLE_FIELDS[d.fieldId];
        if (!field) return null;
        const grower = GROWERS.find(g => g.id === field.growerId);
        return { ...d, field, grower, filename: `${grower.name.replace(/\s+/g, '_').replace(/[^\w]/g, '')}_${field.name.replace(/\s+/g, '_')}_2026_Plan.pdf` };
      })
      .filter(Boolean)
      .filter(d => filter === 'all' || d.status === filter)
      .filter(d => {
        const q = searchTerm.toLowerCase();
        return !q || d.field.name.toLowerCase().includes(q) || d.grower.name.toLowerCase().includes(q) || (d.signedBy || '').toLowerCase().includes(q);
      });
  }, [searchTerm, filter]);

  const counts = {
    all: LIBRARY_DOCS.length,
    signed: LIBRARY_DOCS.filter(d => d.status === 'signed').length,
    downloaded: LIBRARY_DOCS.filter(d => d.status === 'downloaded').length,
  };

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      <section className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-3">
            Document Archive
          </div>
          <h1 className="font-serif text-[40px] text-[#2b2a26] tracking-tight leading-tight mb-2">
            Library
          </h1>
          <p className="text-[14px] text-[#4a4840]">All signed and downloaded field plan PDFs · click any row to re-open</p>
        </div>
        <button className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#2b2a26] text-[#faf7f0] px-4 py-2.5 hover:bg-[#4a4840] transition-colors flex items-center gap-2">
          <Download className="w-3 h-3" strokeWidth={1.5} /> Export list
        </button>
      </section>

      <div className="mb-6 flex flex-wrap gap-3 items-stretch">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6758]" strokeWidth={1.5} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-white border border-[#e8e3d8] focus:border-[#2b2a26] focus:outline-none pl-11 pr-4 py-3 text-[13px] text-[#2b2a26]"
          />
        </div>
        <div className="flex gap-0 border border-[#2b2a26]">
          {[{k:'all', label:'All'}, {k:'signed', label:'Signed'}, {k:'downloaded', label:'Downloaded'}].map((f, i) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-5 py-3 text-[10px] tracking-[0.15em] uppercase font-semibold transition-colors ${
                i < 2 ? 'border-r border-[#2b2a26]' : ''
              } ${
                filter === f.k ? 'bg-[#2b2a26] text-[#faf7f0]' : 'bg-white text-[#6b6758] hover:bg-[#f5f1e8] hover:text-[#2b2a26]'
              }`}
            >
              {f.label} ({counts[f.k]})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e8e3d8]">
        <div className="grid grid-cols-[2fr_1.3fr_120px_130px_1fr] gap-4 px-5 py-3 border-b border-[#e8e3d8] bg-[#f5f1e8]">
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Document</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Grower</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Generated</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Status</div>
          <div className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Signed by</div>
        </div>
        {docs.map((d, i) => (
          <button
            key={i}
            onClick={() => onOpenLibraryDoc(d.fieldId)}
            className="w-full grid grid-cols-[2fr_1.3fr_120px_130px_1fr] gap-4 px-5 py-4 border-b border-[#e8e3d8] last:border-b-0 text-left hover:bg-[#f5f1e8] transition-colors items-center"
          >
            <div className="flex items-start gap-3 min-w-0">
              <FileText className="w-4 h-4 text-[#6b6758] shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="min-w-0">
                <div className="font-serif text-[15px] text-[#2b2a26] tracking-tight leading-tight">{d.field.name}</div>
                <div className="text-[10px] text-[#6b6758] font-mono mt-0.5 truncate">{d.filename}</div>
              </div>
            </div>
            <div className="text-[12px] text-[#4a4840]">{d.grower.name}</div>
            <div className="text-[11px] text-[#6b6758] font-mono">{d.generatedOn}</div>
            <div>
              {d.status === 'signed' ? (
                <span className="inline-flex items-center gap-1.5 bg-[#e7efe2] text-[#3f5a3a] px-2.5 py-1 text-[10px] font-semibold tracking-wide">
                  <PenTool className="w-3 h-3" strokeWidth={1.5} /> Signed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-[#eeeae0] text-[#6b6758] px-2.5 py-1 text-[10px] font-semibold tracking-wide">
                  <Download className="w-3 h-3" strokeWidth={1.5} /> Downloaded
                </span>
              )}
            </div>
            <div>
              {d.signedBy ? (
                <>
                  <div className="text-[12px] text-[#2b2a26]">{d.signedBy}</div>
                  <div className="text-[10px] text-[#6b6758] font-mono">{d.signedOn}</div>
                </>
              ) : (
                <span className="text-[#6b6758] font-mono text-[12px]">—</span>
              )}
            </div>
          </button>
        ))}
        {docs.length === 0 && (
          <div className="px-5 py-16 text-center text-[12px] text-[#6b6758]">
            No documents match your search.
          </div>
        )}
      </div>
    </main>
  );
}

// =====================================================================
// FIELD DETAIL VIEW
// =====================================================================

function FieldDetailView({ user, selectedFieldId, onChangeField, onBack, autoOpenPDF }) {
  const field = SAMPLE_FIELDS[selectedFieldId];
  const grower = GROWERS.find(g => g.id === field.growerId);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedRecIds, setSelectedRecIds] = useState(new Set());
  const [resourcePanelRec, setResourcePanelRec] = useState(null);
  const [showOnePagerModal, setShowOnePagerModal] = useState(!!autoOpenPDF);
  const [showTextModal, setShowTextModal] = useState(false);

  const recommendations = useMemo(() => generateRecommendations(field), [field]);

  // Auto-select critical/high recommendations by default
  useEffect(() => {
    const defaultSelected = new Set(
      recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').map(r => r.id)
    );
    setSelectedRecIds(defaultSelected);
  }, [field.id, recommendations]);

  const totalUplift = recommendations.filter(r => r.totalValue).reduce((sum, r) => sum + r.totalValue, 0);

  const chemistryStatus = {
    pH: field.chemistry.pH < 6.0 ? 'deficient' : field.chemistry.pH > 7.5 ? 'low' : 'optimal',
    OM: field.chemistry.OM < 2.5 ? 'low' : 'optimal',
    P: field.chemistry.P_bray < 15 ? 'deficient' : 'optimal',
    K: field.chemistry.K < 120 ? 'deficient' : 'optimal',
  };

  const handleFieldSwitch = (id) => {
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setSelectedYear(2026);
    onChangeField(id);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 700);
  };

  const toggleRecSelection = (id) => {
    setSelectedRecIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedRecs = recommendations.filter(r => selectedRecIds.has(r.id));

  // All fields for the scroller, with this grower's fields first
  const allFields = useMemo(() => {
    const growerFields = Object.values(SAMPLE_FIELDS).filter(f => f.growerId === grower.id);
    const otherFields = Object.values(SAMPLE_FIELDS).filter(f => f.growerId !== grower.id);
    return [...growerFields, ...otherFields];
  }, [grower.id]);

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#6b6758] hover:text-[#2b2a26] transition-colors mb-6">
        <ArrowLeft className="w-3 h-3" /> Back to Portfolio
      </button>

      {/* Hero */}
      <section className="mb-8 max-w-3xl">
        <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase mb-3">
          {grower.name} · Field Detail
        </div>
        <h1 className="font-serif text-[44px] md:text-[52px] leading-[0.95] text-[#2b2a26] tracking-tight mb-3">
          Hello, <em className="text-[#c8893f] not-italic" style={{ fontStyle: 'italic' }}>{user.firstName}</em>.
        </h1>
        <p className="text-[15px] text-[#4a4840] leading-relaxed">
          Reviewing <span className="font-semibold text-[#2b2a26]">{field.name}</span> with {grower.owner}. Select fields below to switch; pick recommendations to include in the grower 1-pager.
        </p>
      </section>

      {/* Field scroller (horizontal) */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-[10px] tracking-[0.25em] text-[#6b6758] font-semibold uppercase">Switch Field</div>
          <div className="text-[10px] tracking-[0.1em] text-[#6b6758] font-mono">{allFields.length} fields · scroll →</div>
        </div>
        <div className="overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
          <div className="flex gap-0 border border-[#2b2a26] bg-white inline-flex">
            {allFields.map((f, i) => {
              const isActive = f.id === selectedFieldId;
              const criticalCount = f.pathogens.filter(p => p.pct >= 70).length;
              const fGrower = GROWERS.find(g => g.id === f.growerId);
              return (
                <button
                  key={f.id}
                  onClick={() => handleFieldSwitch(f.id)}
                  className={`text-left p-4 transition-colors duration-200 shrink-0 w-[240px] ${
                    i < allFields.length - 1 ? 'border-r border-[#2b2a26]' : ''
                  } ${
                    isActive ? 'bg-[#2b2a26] text-[#faf7f0]' : 'bg-white hover:bg-[#f5f1e8] text-[#2b2a26]'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div className="font-serif text-[18px] tracking-tight truncate">{f.name}</div>
                    {criticalCount > 0 && (
                      <div className={`text-[8px] font-bold tracking-[0.15em] px-1.5 py-0.5 shrink-0 ml-2 ${
                        isActive ? 'bg-[#c8893f] text-[#2b2a26]' : 'bg-[#b8442f] text-white'
                      }`}>
                        {criticalCount} CRIT
                      </div>
                    )}
                  </div>
                  <div className={`text-[10px] tracking-[0.05em] uppercase ${isActive ? 'text-[#c8893f]' : 'text-[#6b6758]'} truncate`}>
                    {fGrower.name}
                  </div>
                  <div className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-[#e8e3d8]' : 'text-[#6b6758]'}`}>
                    {f.crop} · {f.acres} ac
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {isAnalyzing && (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6b6758]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[11px] tracking-[0.2em] uppercase">Analyzing soil profile</span>
        </div>
      )}

      {!isAnalyzing && hasAnalyzed && (
        <>
          {/* Summary bar */}
          <section className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#2b2a26] bg-white">
            <div className="p-5 border-r border-[#2b2a26]">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3 h-3 text-[#6b6758]" strokeWidth={1.5} />
                <span className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Field</span>
              </div>
              <div className="font-serif text-xl text-[#2b2a26] tracking-tight">{field.name}</div>
              <div className="text-[10px] font-mono text-[#6b6758] mt-0.5">{field.acres} acres · {field.region}</div>
            </div>
            <div className="p-5 border-r-0 md:border-r border-[#2b2a26]">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3 h-3 text-[#6b6758]" strokeWidth={1.5} />
                <span className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Critical pathogens</span>
              </div>
              <div className="font-mono text-2xl tabular-nums text-[#2b2a26] font-medium">
                {field.pathogens.filter(p => p.pct >= 70).length}
                <span className="text-sm text-[#6b6758] ml-1">/ {field.pathogens.length}</span>
              </div>
              <div className="text-[10px] text-[#6b6758] mt-0.5">≥70th percentile</div>
            </div>
            <div className="p-5 border-r border-[#2b2a26] border-t md:border-t-0">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3 h-3 text-[#6b6758]" strokeWidth={1.5} />
                <span className="text-[9px] tracking-[0.15em] text-[#6b6758] font-semibold uppercase">Recommendations</span>
              </div>
              <div className="font-mono text-2xl tabular-nums text-[#2b2a26] font-medium">{recommendations.length}</div>
              <div className="text-[10px] text-[#6b6758] mt-0.5">{selectedRecIds.size} selected for report</div>
            </div>
            <div className="p-5 border-t md:border-t-0 bg-[#2b2a26] text-[#faf7f0]">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3 h-3 text-[#c8893f]" strokeWidth={1.5} />
                <span className="text-[9px] tracking-[0.15em] text-[#c8893f] font-semibold uppercase">Est. uplift</span>
              </div>
              <div className="font-mono text-2xl tabular-nums text-[#c8893f] font-medium">${totalUplift.toLocaleString()}</div>
              <div className="text-[10px] text-[#e8e3d8] mt-0.5">across {field.acres} acres</div>
            </div>
          </section>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
            <aside className="space-y-8">
              {/* Chemistry */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#2b2a26]">
                  <Beaker className="w-3.5 h-3.5 text-[#2b2a26]" strokeWidth={1.5} />
                  <h2 className="text-[11px] tracking-[0.2em] text-[#2b2a26] font-semibold uppercase">TraceCHEM</h2>
                  <span className="text-[9px] text-[#6b6758] font-mono ml-auto">input</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ChemistryTile label="pH" value={field.chemistry.pH} unit="" status={chemistryStatus.pH} />
                  <ChemistryTile label="Buffer pH" value={field.chemistry.bpH} unit="" status="optimal" />
                  <ChemistryTile label="Organic Matter" value={field.chemistry.OM} unit="%" status={chemistryStatus.OM} />
                  <ChemistryTile label="CEC" value={field.chemistry.CEC} unit="meq" status="optimal" />
                  <ChemistryTile label="P (Bray)" value={field.chemistry.P_bray} unit="ppm" status={chemistryStatus.P} />
                  <ChemistryTile label="Potassium" value={field.chemistry.K} unit="ppm" status={chemistryStatus.K} />
                  <ChemistryTile label="Nitrate" value={field.chemistry.Nitrate} unit="ppm" status="optimal" />
                  <ChemistryTile label="Ammonium" value={field.chemistry.Ammonium} unit="ppm" status="optimal" />
                </div>
              </div>

              {/* Pathogens with historical tabs */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#2b2a26]">
                  <Dna className="w-3.5 h-3.5 text-[#2b2a26]" strokeWidth={1.5} />
                  <h2 className="text-[11px] tracking-[0.2em] text-[#2b2a26] font-semibold uppercase">Pathogen Profile</h2>
                  <span className="text-[9px] text-[#6b6758] font-mono ml-auto">metagenomic</span>
                </div>

                {/* Year tabs */}
                <div className="flex gap-0 mb-3 border border-[#2b2a26]">
                  {[2023, 2024, 2025, 2026].map((y, i) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`flex-1 py-2 text-[10px] tracking-[0.15em] font-semibold transition-colors ${
                        i < 3 ? 'border-r border-[#2b2a26]' : ''
                      } ${
                        selectedYear === y
                          ? 'bg-[#2b2a26] text-[#faf7f0]'
                          : 'bg-white text-[#6b6758] hover:bg-[#f5f1e8] hover:text-[#2b2a26]'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-[#e8e3d8] px-4 py-2">
                  {field.pathogens.map((p, i) => (
                    <HistoricalPathogenBar key={i} pathogen={p} selectedYear={selectedYear} />
                  ))}
                </div>
                <div className="text-[9px] text-[#6b6758] mt-2 tracking-wide leading-relaxed">
                  Percentiles benchmarked against {field.region} for {field.crop.toLowerCase()}. Historical comparison shows multi-year pressure trends — rising trends flagged for preemptive action.
                </div>
              </div>
            </aside>

            <section>
              <div className="flex items-center gap-2 mb-5 pb-2 border-b-2 border-[#2b2a26]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5a7555] animate-pulse" />
                <h2 className="text-[11px] tracking-[0.2em] text-[#2b2a26] font-semibold uppercase">Prioritized Action Plan</h2>
                <span className="text-[9px] text-[#6b6758] font-mono ml-auto">AI-synthesized · {recommendations.length} items · {selectedRecIds.size} selected</span>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    selected={selectedRecIds.has(rec.id)}
                    onToggleSelect={toggleRecSelection}
                    onShowResources={setResourcePanelRec}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowOnePagerModal(true)}
                  disabled={selectedRecIds.size === 0}
                  className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#2b2a26] text-[#faf7f0] px-4 py-2.5 hover:bg-[#4a4840] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-3 h-3" /> Edit & export grower 1-pager <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowTextModal(true)}
                  disabled={selectedRecIds.size === 0}
                  className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-white text-[#2b2a26] border border-[#2b2a26] px-4 py-2.5 hover:bg-[#f5f1e8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-3 h-3" /> Text {grower.owner.split(' ')[0]}
                </button>
              </div>
              {selectedRecIds.size === 0 && (
                <div className="text-[10px] text-[#6b6758] mt-2">Select at least one recommendation above to send to grower.</div>
              )}
            </section>
          </div>
        </>
      )}

      {/* Modals / panels */}
      {resourcePanelRec && <ResourcesPanel rec={resourcePanelRec} onClose={() => setResourcePanelRec(null)} />}
      {showOnePagerModal && (
        <GrowerOnePagerModal
          field={field}
          grower={grower}
          user={user}
          selectedRecs={selectedRecs}
          onClose={() => setShowOnePagerModal(false)}
        />
      )}
      {showTextModal && (
        <TextToGrowerModal
          field={field}
          grower={grower}
          user={user}
          selectedRecs={selectedRecs}
          onClose={() => setShowTextModal(false)}
        />
      )}
    </main>
  );
}

// =====================================================================
// ROOT APP
// =====================================================================

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('portfolio'); // 'portfolio' | 'field' | 'growers' | 'library'
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [autoOpenPDF, setAutoOpenPDF] = useState(false);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId);
    setAutoOpenPDF(false);
    setView('field');
  };

  const handleSelectGrower = (growerId) => {
    // Find the first field for this grower and navigate to it
    const firstField = Object.values(SAMPLE_FIELDS).find(f => f.growerId === growerId);
    if (firstField) {
      setSelectedFieldId(firstField.id);
      setAutoOpenPDF(false);
      setView('field');
    }
  };

  const handleOpenLibraryDoc = (fieldId) => {
    setSelectedFieldId(fieldId);
    setAutoOpenPDF(true);
    setView('field');
  };

  const handleBackToPortfolio = () => {
    setView('portfolio');
    setAutoOpenPDF(false);
  };

  const handleLogout = () => {
    setUser(null);
    setView('portfolio');
    setSelectedFieldId(null);
    setAutoOpenPDF(false);
  };

  const handleNavigate = (v) => {
    setView(v);
    setAutoOpenPDF(false);
    if (v === 'portfolio' || v === 'growers' || v === 'library') {
      setSelectedFieldId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] font-sans">
      <GlobalStyles />
      <TopNav user={user} currentView={view} onNavigate={handleNavigate} onLogout={handleLogout} />
      {view === 'portfolio' && (
        <PortfolioView user={user} onSelectField={handleSelectField} />
      )}
      {view === 'growers' && (
        <GrowersView user={user} onSelectGrower={handleSelectGrower} />
      )}
      {view === 'library' && (
        <LibraryView onOpenLibraryDoc={handleOpenLibraryDoc} />
      )}
      {view === 'field' && selectedFieldId && (
        <FieldDetailView
          user={user}
          selectedFieldId={selectedFieldId}
          onChangeField={setSelectedFieldId}
          onBack={handleBackToPortfolio}
          autoOpenPDF={autoOpenPDF}
        />
      )}
    </div>
  );
}

// Data Generator for Monitoring Demo
// Usage:
//   node data-generator.js normal    # Simulate normal traffic
//   node data-generator.js highload  # Simulate high load
//   node data-generator.js error     # Simulate error conditions

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function generateNormalTraffic() {
  console.log('Generating normal traffic...');
  for (let i = 0; i < 10; i++) {
    try {
      await axios.get(`${API_URL}/api/health`);
      console.log(`Normal request ${i + 1} sent.`);
    } catch (e) {
      console.log(`Normal request ${i + 1} failed.`);
    }
  }
}

async function generateHighLoad() {
  console.log('Generating high load...');
  for (let i = 0; i < 100; i++) {
    try {
      await axios.get(`${API_URL}/api/health`);
      console.log(`High load request ${i + 1} sent.`);
    } catch (e) {
      console.log(`High load request ${i + 1} failed.`);
    }
  }
}

async function generateErrors() {
  console.log('Generating error traffic...');
  for (let i = 0; i < 20; i++) {
    try {
      await axios.get(`${API_URL}/test-error`);
      console.log(`Error request ${i + 1} sent.`);
    } catch (e) {
      console.log(`Error request ${i + 1} failed.`);
    }
  }
}

async function runScenario(scenario) {
  if (scenario === 'normal') await generateNormalTraffic();
  else if (scenario === 'highload') await generateHighLoad();
  else if (scenario === 'error') await generateErrors();
  else console.log('Unknown scenario. Use: normal, highload, or error');
}

const scenario = process.argv[2] || 'normal';
runScenario(scenario);
// Data Generator for Monitoring Demo
// Usage:
//   node data-generator.js normal    # Simulate normal traffic
//   node data-generator.js highload  # Simulate high load
//   node data-generator.js error     # Simulate error conditions

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function generateNormalTraffic() {
  for (let i = 0; i < 10; i++) {
    await axios.get(`${API_URL}/api/health`).catch(() => {});
  }
}

async function generateHighLoad() {
  for (let i = 0; i < 100; i++) {
    await axios.get(`${API_URL}/api/health`).catch(() => {});
  }
}

async function generateErrors() {
  for (let i = 0; i < 20; i++) {
    await axios.get(`${API_URL}/test-error`).catch(() => {});
  }
}

async function runScenario(scenario) {
  if (scenario === 'normal') await generateNormalTraffic();
  else if (scenario === 'highload') await generateHighLoad();
  else if (scenario === 'error') await generateErrors();
  else console.log('Unknown scenario');
}

const scenario = process.argv[2] || 'normal';
runScenario(scenario); 
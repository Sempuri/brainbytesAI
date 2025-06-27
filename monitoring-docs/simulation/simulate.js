import axios from 'axios';

const PROM_URL = 'http://localhost:3000/metrics';
const METRIC_PUSH_DELAY = 2000; 

async function simulatePeakLoad() {
  console.log('[Scenario A] Simulating peak load...');
  for (let i = 0; i < 10; i++) {
    await axios.get(`${PROM_URL}/simulate?type=success`);
    await new Promise(res => setTimeout(res, 100));
  }
}

async function simulateErrorSpike() {
  console.log('[Scenario B] Simulating AI error spike...');
  for (let i = 0; i < 5; i++) {
    await axios.get(`${PROM_URL}/simulate?type=error`);
    await new Promise(res => setTimeout(res, 200));
  }
}

async function simulateNetworkLag() {
  console.log('[Scenario C] Simulating slow AI responses...');
  for (let i = 0; i < 5; i++) {
    await axios.get(`${PROM_URL}/simulate?type=slow`);
    await new Promise(res => setTimeout(res, 1000));
  }
}

async function runScenarios() {
  await simulatePeakLoad();
  await simulateErrorSpike();
  await simulateNetworkLag();
  console.log('All scenarios completed.');
}

console.log("Simulation request sent to /metrics/simulate?type=success");

runScenarios();



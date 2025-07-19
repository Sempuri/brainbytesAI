import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const register = client.register;

// Counter
const aiResponses = new client.Counter({
  name: "brainbytes_ai_responses_total",
  help: "Total number of AI responses sent to users",
  labelNames: ["status"],
});

export const mobileSessions = new client.Counter({
  name: "mobile_sessions_total",
  help: "Total number of sessions from mobile users",
  labelNames: ["device_type"],
});

// Gauge
const activeSessions = new client.Gauge({
  name: "brainbytes_active_sessions",
  help: "Current number of active learning sessions",
});

export const mobileUsersGauge = new client.Gauge({
  name: "mobile_users_online",
  help: "Current number of mobile users online",
});

// Histogram
const responseTime = new client.Histogram({
  name: "brainbytes_ai_response_time_seconds",
  help: "AI response time in seconds",
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const mobileLatency = new client.Histogram({
  name: "mobile_latency_seconds",
  help: "Latency experienced by mobile users in seconds",
  buckets: [0.1, 0.3, 0.5, 1, 2, 3, 5],
});

register.registerMetric(aiResponses);
register.registerMetric(activeSessions);
register.registerMetric(responseTime);

export { aiResponses, activeSessions, responseTime, register };

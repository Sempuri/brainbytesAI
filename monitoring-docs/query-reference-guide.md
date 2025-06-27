# PromQL Query Reference

## Application Insights
- `rate(brainbytes_ai_responses_total[1m])`: Number of AI responses per second.
- `brainbytes_active_sessions`: Current number of learning sessions.
- `histogram_quantile(0.9, rate(brainbytes_ai_response_time_seconds_bucket[5m]))`: 90th percentile AI response time.

## System Health
- `up`: Check if services are running.
- `node_memory_Active_bytes`: RAM usage.
- `node_cpu_seconds_total`: CPU time per mode.

## Business Impact
- `sum(brainbytes_ai_responses_total) by (status)`: Breakdown of responses by status.

----------------------------------------------------------------------------------------------------------------------

Useful queries for monitoring BrainBytes:

1. **Total AI Responses per Minute**
   ```promql
   sum(rate(brainbytes_ai_responses_total[1m]))

2. **Number of Active Sessions**
   ```promql
   brainbytes_active_sessions

3. **90th Percentile AI Response Time**
   ```promql
   histogram_quantile(0.9, sum(rate(brainbytes_ai_response_time_seconds_bucket[5m])) by (le))

4. **AI Error Rate**
   ```promql
   sum(rate(brainbytes_ai_responses_total{status="error"}[5m]))

5. **AI Success Rate**
   ```promql
  sum(rate(brainbytes_ai_responses_total{status="success"}[5m]))

6. **Session Growth Trend**
   ```promql
   increase(brainbytes_active_sessions[1h])

7. **Total Responses (Last 5 Minutes)**
   ```promql
   sum(increase(brainbytes_ai_responses_total[5m]))

8. **Average Response Time**
   ```promql
   rate(brainbytes_ai_response_time_seconds_sum[5m]) / rate(brainbytes_ai_response_time_seconds_count[5m])

9. **Top Response Times (Histogram Buckets)**
   ```promql
   sum(rate(brainbytes_ai_response_time_seconds_bucket[5m])) by (le)

10. **Alert if No AI Response in 1 Min**
   ```promql
   absent(brainbytes_ai_responses_total[1m])

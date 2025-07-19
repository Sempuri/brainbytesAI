| Metric Name                         | Type      | Description                                  | Labels | Example Query                                                                  |
| ----------------------------------- | --------- | -------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| brainbytes_ai_responses_total       | Counter   | Total number of AI responses sent            | status | rate(brainbytes_ai_responses_total[5m])                                        |
| brainbytes_active_sessions          | Gauge     | Number of currently active learning sessions | none   | brainbytes_active_sessions                                                     |
| brainbytes_ai_response_time_seconds | Histogram | AI response time in seconds                  | none   | histogram_quantile(0.95, rate(brainbytes_ai_response_time_seconds_bucket[5m])) |

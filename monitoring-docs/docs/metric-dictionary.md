# Metric Dictionary

| Name                        | Description                        | Calculation/Source | Normal Range | Unusual Value Meaning |
|-----------------------------|------------------------------------|--------------------|--------------|----------------------|
| http_errors_total           | Total HTTP errors                  | App counter        | 0-5/min      | Bug, overload        |
| http_requests_total         | Total HTTP requests                | App counter        | 10-1000/min  | Traffic spike/drop   |
| node_cpu_seconds_total      | CPU seconds used                   | Node Exporter      | <80%         | High load            |
| container_memory_usage_bytes| Container memory usage             | cAdvisor/Exporter  | <70%         | Memory leak          |
| http_request_duration_seconds| Request latency                    | App histogram      | <1s          | Slowness, bottleneck | 
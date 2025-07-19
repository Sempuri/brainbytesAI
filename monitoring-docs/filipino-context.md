# Filipino Context in Monitoring

This file documents special considerations for Filipino users.

## Mobile-Centric Metrics

- Add future metrics for mobile app latency and bandwidth.
- Monitor mobile device response times when frontend is containerized separately.

## Intermittent Connectivity Handling

- Use alerts for abnormal disconnection spikes.
- Adjust scrape interval to tolerate 30s–1m loss of connectivity.

## Bandwidth Optimization

- Future: Track data size per session (to help users avoid excessive data usage).
- Avoid frequent polling endpoints on frontend.

## Threshold Localization

- Alert thresholds are made adaptive:
  - AI latency of 5s is tolerable during mobile data.
  - Less strict session count expectations during weekends.

## Cloud Resource Cost Awareness

- Optimize recording rule frequency to reduce storage overhead.
- Use `min` and `max` time-range queries for budgeting and billing visibility.

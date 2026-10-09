---
description: "Store ProbeHarbor readings long-term in InfluxDB or VictoriaMetrics by scraping its Prometheus metrics with Telegraf; sample config included."
---

# InfluxDB, Telegraf & VictoriaMetrics

Scrape Pro Prometheus metrics into a long-term TSDB — same endpoint Grafana uses.

- Product guide: [probeharbor.dev/integrations/influx](https://probeharbor.dev/integrations/influx)
- Telegraf sample: [probeharbor.dev/telegraf/probeharbor.conf](https://probeharbor.dev/telegraf/probeharbor.conf)
- Grafana: [Grafana & Prometheus](/integrations/grafana)

```http
GET /api/v1/metrics
Authorization: Bearer <api-key>
```

Metric: `probeharbor_sensor_value{device,key,kind}` (numeric only).

```bash
export PROBEHARBOR_API_KEY=…
export INFLUX_TOKEN=…
export INFLUX_ORG=…
export INFLUX_BUCKET=probeharbor
telegraf --config probeharbor.conf
```

For VictoriaMetrics, use the commented `outputs.http` Prometheus remote-write block in the sample config.

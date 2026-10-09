---
description: "Graph ProbeHarbor probes in Grafana by scraping the Prometheus metrics endpoint with an API key; Prometheus data source setup."
---

# Grafana & Prometheus

Pro API keys expose Prometheus metrics:

```http
GET https://probeharbor.dev/api/v1/metrics
Authorization: Bearer <api-key>
```

## Grafana

1. Create an API key under **Dashboard → Share**  
2. Add a Prometheus data source (or use Infinity / scrape) pointing at the metrics URL with the Bearer header  
3. Import the dashboard JSON:

- Docs/repo path: [`public/grafana/probeharbor-dashboard.json`](https://github.com/doodersrage/thermaltrace/blob/main/public/grafana/probeharbor-dashboard.json)  
- Download: [probeharbor.dev/grafana/probeharbor-dashboard.json](https://probeharbor.dev/grafana/probeharbor-dashboard.json)

## Example scrape config

```yaml
scrape_configs:
  - job_name: probeharbor
    metrics_path: /api/v1/metrics
    scheme: https
    static_configs:
      - targets: ["probeharbor.dev"]
    authorization:
      type: Bearer
      credentials: <your-api-key>
```

Metrics are a single gauge, `probeharbor_sensor_value`, with `device`, `key`, and `kind` labels (`temperature`, `humidity`, `flood`, …). The bundled dashboard graphs those kinds.

Want InfluxDB or VictoriaMetrics instead of (or in addition to) Grafana? See [InfluxDB & Telegraf](/integrations/influx) and the sample [Telegraf config](https://probeharbor.dev/telegraf/probeharbor.conf).

The in-app Share page also shows a Grafana setup wizard with a filled-in snippet for your key.

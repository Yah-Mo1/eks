resource "helm_release" "grafana" {
  name             = "grafana"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "grafana"
  version          = "9.3.0"
  namespace        = "monitoring"
  create_namespace = true

  values = [
    file("${path.module}/values/grafana.yaml")
  ]

  depends_on = [
    kubectl_manifest.argocd_cluster_issuer
  ]

}
resource "helm_release" "prometheus" {
  name             = "prometheus"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "prometheus"
  version          = "27.28.2"
  namespace        = "monitoring"
  create_namespace = true

  values = [
    file("${path.module}/values/prometheus.yaml")
  ]

  depends_on = [
    aws_eks_addon.csi_driver, kubectl_manifest.argocd_cluster_issuer
  ]

}



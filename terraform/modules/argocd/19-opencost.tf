# resource "helm_release" "opencost" {
#   name             = "opencost"
#   repository       = "https://opencost.github.io/opencost-helm-chart"
#   chart            = "opencost"
#   version          = "0.1.0"
#   namespace        = "opencost"
#   create_namespace = true

#   values = [
#     file("${path.module}/values/opencost.yaml")
#   ]

#   depends_on = [
#     helm_release.prometheus
#   ]
# }
terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "1.19.0"
    }
  }
}

resource "kubectl_manifest" "argocd_cluster_issuer" {
  yaml_body = <<YAML
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: issuer
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: ${var.email}
    privateKeySecretRef:
      name: issuer
    solvers:
      - dns01:
          route53:
            hostedZoneID: ${var.route53_zone_id}
            region: eu-west-2
        selector:
          dnsZones:
            - tm-yahya.com
      - http01:
          ingress:
            class: nginx

YAML
}


resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "8.2.4"
  namespace        = "argocd"
  create_namespace = true
  timeout          = 600

  values = [
    file("${path.module}/values/argocd.yaml")
  ]

  depends_on = [
    kubectl_manifest.argocd_cluster_issuer
  ]
}
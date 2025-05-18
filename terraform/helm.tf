resource "helm_release" "nginx" {
  name       = "nginx-ingress"
  repository = "https://helm.nginx.com/stable"
  chart      = "nginx-ingress"

  create_namespace = true
  namespace        = "nginx-ingress"

}

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"

  create_namespace = true
  namespace        = "cert-manager"

  # set {
  #   name  = "wait-for"
  #   value = module.cert_manager_irsa_role.iam_role_arn
  # }
  

  depends_on = [ module.cert_manager_irsa_role ]
  set {
    name  = "installCRDs"
    value = true

  }


  values = [
    "${file("helm-values/cert-manager.yaml")}"
  ]


}


resource "helm_release" "external_dns" {
  name       = "external-dns"
  repository = "oci://registry-1.docker.io/bitnamicharts"
  chart      = "external-dns"

  create_namespace = true
  namespace        = "external-dns"

  set {
    name  = "wait-for"
    value = module.external_dns_irsa_role.iam_role_arn
  }
  # depends_on = [module.external_dns_irsa_role ]
  set {
    name  = "installCRDs"
    value = true

  }


  values = [
    "${file("helm-values/external-dns.yaml")}"
  ]


}
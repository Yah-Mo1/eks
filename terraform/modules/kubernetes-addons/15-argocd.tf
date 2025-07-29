resource "helm_release" "argocd" {
    name = "argocd"
    repository = "https://argoproj.github.io/argo-helm"
    chart = "argo-cd"
    version = "8.2.2"
    namespace = "argocd"
    create_namespace = true
    timeout = 600

    values = [
        file("${path.module}/values/argocd.yaml")
    ]
}
resource "aws_eks_addon" "pod_identity_addon" {
    cluster_name = var.cluster_name
    addon_name = "eks-pod-identity-agent"
    addon_version = "v1.3.8-eksbuild.2"
}
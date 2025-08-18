resource "aws_iam_role" "external_dns_role" {
  name = "${var.cluster_name}-external-dns-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]
        Effect = "Allow"
        Principal = {
          Service = "pods.eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "external_dns_policy" {
  name = "${var.cluster_name}-external-dns-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["route53:ChangeResourceRecordSets"]
        Resource = ["arn:aws:route53:::hostedzone/${var.route53_zone_id}"]
      },
      {
        Effect = "Allow"
        Action = [
          "route53:ListResourceRecordSets",
          "route53:ListTagsForResource"
        ]
        Resource = ["arn:aws:route53:::hostedzone/${var.route53_zone_id}"]
      },
      {
        Effect   = "Allow"
        Action   = ["route53:ListHostedZones"]
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "external_dns_policy_attachment" {
  role       = aws_iam_role.external_dns_role.name
  policy_arn = aws_iam_policy.external_dns_policy.arn
}


resource "aws_eks_pod_identity_association" "external_dns_pod_identity_association" {
  cluster_name    = var.cluster_name
  namespace       = "external-dns"
  role_arn        = aws_iam_role.external_dns_role.arn
  service_account = "external-dns"

  depends_on = [
    aws_iam_role_policy_attachment.external_dns_policy_attachment
  ]
}

resource "helm_release" "external_dns" {
  name             = "external-dns"
  repository       = "https://kubernetes-sigs.github.io/external-dns"
  chart            = "external-dns"
  version          = "1.18.0"
  namespace        = "external-dns"
  create_namespace = true

  values = [
    file("${path.module}/values/external-dns.yaml")
  ]

  depends_on = [
    aws_eks_pod_identity_association.external_dns_pod_identity_association
  ]
}



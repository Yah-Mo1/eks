//Create the iam role for cert manager
//Create the necessary iam policy for cert manager
//Attach the iam policy to the iam role
// Create a pod identity association for the cert manager
// Create the cert manager helm release

resource "aws_iam_role" "cert_manager_role" {
  name = "${var.cluster_name}-cert-manager-role"
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

//modify the policy to allow the cert manager to create and update the certificate
resource "aws_iam_policy" "cert_manager_policy" {
  name = "${var.cluster_name}-cert-manager-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "route53:GetChange"
        Resource = "arn:aws:route53:::change/*"
      },
      {
        Effect = "Allow"
        Action = [
          "route53:ChangeResourceRecordSets",
          "route53:ListResourceRecordSets"
        ]
        Resource = "arn:aws:route53:::hostedzone/${var.route53_zone_id}"
        Condition = {
          "ForAllValues:StringEquals" = {
            "route53:ChangeResourceRecordSetsRecordTypes" = ["TXT"]
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cert_manager_policy_attachment" {
  role       = aws_iam_role.cert_manager_role.name
  policy_arn = aws_iam_policy.cert_manager_policy.arn
}

# Removed redundant EKS addon - using Helm instead for better control

resource "aws_eks_pod_identity_association" "cert_manager_pod_identity_association" {
  cluster_name    = var.cluster_name
  namespace       = "cert-manager"
  role_arn        = aws_iam_role.cert_manager_role.arn
  service_account = "cert-manager"

  depends_on = [
    aws_iam_role_policy_attachment.cert_manager_policy_attachment
  ]
}

resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "1.18.2"
  namespace        = "cert-manager"
  create_namespace = true

  values = [
    file("${path.module}/values/cert-manager.yaml")
  ]

  set = [
    {
      name  = "installCRDs"
      value = "true"
    }
  ]

  depends_on = [
    aws_eks_pod_identity_association.cert_manager_pod_identity_association
  ]
}
data "aws_iam_policy_document" "csi_driver_policy_document" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["pods.eks.amazonaws.com"]
    }
    actions = ["sts:AssumeRole", "sts:TagSession"]
  }
}


resource "aws_iam_role" "csi_driver_role" {
  name               = "${var.cluster_name}-csi-driver-role"
  assume_role_policy = data.aws_iam_policy_document.csi_driver_policy_document.json
}

resource "aws_iam_role_policy_attachment" "csi_driver_policy_attachment" {
  role = aws_iam_role.csi_driver_role.name
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  ])
  policy_arn = each.value
}

# resource "aws_iam_policy" "ebs_csi_driver_encryption_policy" {
#   name = "${var.cluster_name}-ebs-csi-driver-encryption-policy"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = [
#           "kms:Decrypt",
#           "kms:GenerateDataKeyWithoutPlaintext",
#           "kms:CreateGrant",
#         ]
#         Resource = "*"
#         Condition = {
#           StringEquals = {
#           "kms:RequestAlias" = "alias/aws/ebs"
#       }
#     }
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "ebs_csi_driver_encryption_policy_attachment" {
#   role       = aws_iam_role.csi_driver_role.name
#   policy_arn = aws_iam_policy.ebs_csi_driver_encryption_policy.arn
# }

resource "aws_eks_pod_identity_association" "csi_driver_pod_identity_association" {
  cluster_name    = var.cluster_name
  namespace       = "kube-system"
  service_account = "ebs-csi-controller-sa"
  role_arn        = aws_iam_role.csi_driver_role.arn
}

resource "aws_eks_addon" "csi_driver" {
  cluster_name             = var.cluster_name
  addon_name               = "aws-ebs-csi-driver"
  addon_version            = "v1.46.0-eksbuild.1"
  service_account_role_arn = aws_iam_role.csi_driver_role.arn
  depends_on = [
    aws_eks_pod_identity_association.csi_driver_pod_identity_association
  ]
}

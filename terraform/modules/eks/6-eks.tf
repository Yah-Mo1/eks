resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.env}-${var.cluster_name}-eks-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

// TODO: Encrypt eks secrets
resource "aws_kms_key" "eks_key" {
  description             = "EKS Secret Key"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}


//TODO: Need to come back to this =====> EKS Cluster is public and private access is disabled
resource "aws_eks_cluster" "eks_cluster" {
  name     = "${var.env}-${var.cluster_name}"
  version  = var.eks_version
  role_arn = aws_iam_role.eks_cluster_role.arn
  vpc_config {
    endpoint_public_access  = true
    endpoint_private_access = true
    subnet_ids              = var.private_subnets_ids
  }
  access_config {
    authentication_mode                         = "API"
    bootstrap_cluster_creator_admin_permissions = true
  }
   encryption_config {
    resources = ["secrets"]
    provider {
      key_arn = aws_kms_key.eks_key.arn
    }
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy_attachment]
}


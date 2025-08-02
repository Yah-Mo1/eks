resource "aws_iam_role" "eks_node_group_role" {
  name = "${var.env}-${var.cluster_name}-eks-node-group-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_node_group_policy_attachment" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",

  ])
  role       = aws_iam_role.eks_node_group_role.name
  policy_arn = each.value
}

resource "aws_eks_node_group" "eks_node_group" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  version         = var.eks_version
  node_group_name = "${var.env}-${var.cluster_name}-eks-node-group"
  node_role_arn   = aws_iam_role.eks_node_group_role.arn
  capacity_type   = var.capacity_type
  instance_types  = var.instance_types
  subnet_ids      = var.private_subnets_ids
  scaling_config {
    desired_size = 2
    max_size     = 10
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    role = "eks-node-group"
  }

  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }

  depends_on = [aws_iam_role_policy_attachment.eks_node_group_policy_attachment]
}
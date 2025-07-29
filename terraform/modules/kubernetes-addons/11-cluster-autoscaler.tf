resource "aws_iam_role" "cluster_autoscaler_role" {
    name = "${var.cluster_name}-cluster-autoscaler-role"
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

resource "aws_iam_policy" "cluster_autoscaler_policy" {
    name = "${var.cluster_name}-cluster-autoscaler-policy"
    policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:SetDesiredCapacity",
                "autoscaling:TerminateInstanceInAutoScalingGroup"
            ],
            "Resource": "*",
        },
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeScalingActivities",
                "autoscaling:DescribeTags",
                "ec2:DescribeImages",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeLaunchTemplateVersions",
                "ec2:GetInstanceTypesFromInstanceRequirements",
                "eks:DescribeNodegroup"
            ],
            "Resource": "*"
        }
    ]
})
}

resource "aws_iam_role_policy_attachment" "cluster_autoscaler_policy_attachment" {
    role = aws_iam_role.cluster_autoscaler_role.name
    policy_arn = aws_iam_policy.cluster_autoscaler_policy.arn

    depends_on = [aws_iam_role.cluster_autoscaler_role]
}

resource "aws_eks_pod_identity_association" "cluster_autoscaler_pod_identity_association" {
    cluster_name = var.cluster_name
    namespace = "kube-system"
    service_account = "cluster-autoscaler"
    role_arn = aws_iam_role.cluster_autoscaler_role.arn

    depends_on = [aws_iam_role_policy_attachment.cluster_autoscaler_policy_attachment]
}


resource "helm_release" "cluster_autoscaler" {
    name = "${var.cluster_name}-cluster-autoscaler"
    repository = "https://kubernetes.github.io/autoscaler"
    chart = "cluster-autoscaler"
    version = "9.48.0"
    namespace = "kube-system"


    set = [
        {
            name = "awsRegion"
            value = "eu-west-2"
        },
        {
            name = "rbac.serviceAccount.name"
            value = "${aws_eks_pod_identity_association.cluster_autoscaler_pod_identity_association.service_account}"
        },
        {
            name = "autoDiscovery.clusterName"
            value = var.cluster_name
        }
    ]

    depends_on = [helm_release.metrics_server]
}
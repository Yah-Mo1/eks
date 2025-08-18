data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "${var.env}-vpc"
  }
}
 
resource "aws_kms_key" "cloudwatch_logs_key" {
  description             = "KMS key for CloudWatch Logs"
  enable_key_rotation     = true
  deletion_window_in_days = 7
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/awsUser"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow CloudWatch Logs to encrypt and decrypt"
        Effect = "Allow"
        Principal = {
          Service = "logs.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
        Condition = {
          ArnEquals = {
            "kms:EncryptionContext:aws:logs:arn" = "arn:aws:logs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:log-group:${var.env}-vpc-flow-logs-group"
          }
        }
      }
    ]
  })
}
 resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "${var.env}-vpc-flow-logs-group"
  retention_in_days = 365
  kms_key_id        = aws_kms_key.cloudwatch_logs_key.arn
  tags = {
    Name        = "${var.env}-vpc-flow-logs"
    Environment = var.env
  }

  depends_on = [ aws_kms_key.cloudwatch_logs_key ]
}


# IAM Role for VPC Flow Logs
resource "aws_iam_role" "vpc_flow_logs_role" {
  name = "${var.env}-vpc-flow-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.env}-vpc-flow-logs-role"
    Environment = var.env
  }
}


# IAM Policy for VPC Flow Logs
resource "aws_iam_role_policy" "vpc_flow_logs_policy" {
  name = "${var.env}-vpc-flow-logs-policy"
  role = aws_iam_role.vpc_flow_logs_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
          ArnLike = { 
            "aws:SourceArn" = "arn:aws:ec2:eu-west-2:${data.aws_caller_identity.current.account_id}:vpc-flow-log/*"
          }
        }
      }
    ]
  })
}

# VPC Flow Logs
resource "aws_flow_log" "vpc_flow_logs" {
  iam_role_arn    = aws_iam_role.vpc_flow_logs_role.arn
  log_destination = aws_cloudwatch_log_group.vpc_flow_logs.arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.this.id

  tags = {
    Name        = "${var.env}-vpc-flow-logs"
    Environment = var.env
  }
  depends_on = [aws_cloudwatch_log_group.vpc_flow_logs]
}

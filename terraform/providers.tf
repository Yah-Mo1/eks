terraform {
  backend "s3" {
    bucket  = "eks-tfstate-yahya"
    key     = "eks-lab"
    region  = "eu-west-2"
    encrypt = true


  }

  required_version = ">=1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.4.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "3.0.2"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.31"
    }

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "1.19.0"
    }
  }


}

provider "aws" {
  region = "eu-west-2"
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}


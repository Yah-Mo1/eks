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
  }


}

provider "aws" {
  region = "eu-west-2"
}


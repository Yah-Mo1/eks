locals {
  name   = "eks-lab"
  domain = "lab.yahya.com"
  region = "eu-west-2" #London Region

  tags = {
    Environment = "sandbox"
    Project     = "EKS Advanced Lab"
    Owner       = "yahya"
  }

}
locals {
  env            = "dev"
  azs            = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
  eks_version    = "1.30"
  capacity_type  = "SPOT"
  instance_types = ["t3.large"]
}
module "vpc" {
  source                      = "./modules/vpc"
  vpc_cidr                    = var.vpc_cidr
  env                         = local.env
  azs                         = local.azs
  private_subnets_cidr_blocks = var.private_subnets_cidr_blocks
  public_subnets_cidr_blocks  = var.public_subnets_cidr_blocks
  private_subnets_tags = {
    "kubernetes.io/role/internal-elb"                        = "1"
    "kubernetes.io/cluster/${local.env}-${var.cluster_name}" = "owned"
  }
  public_subnets_tags = {
    "kubernetes.io/role/elb"                                 = "1"
    "kubernetes.io/cluster/${local.env}-${var.cluster_name}" = "owned"
  }
}

module "eks" {
  source              = "./modules/eks"
  env                 = local.env
  cluster_name        = var.cluster_name
  eks_version         = local.eks_version
  capacity_type       = local.capacity_type
  instance_types      = local.instance_types
  private_subnets_ids = module.vpc.private_subnets_ids
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_name
}


provider "helm" {
  kubernetes = {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }

}

// Comment out for now until eks is created
module "kubernetes-addons" {
  source          = "./modules/kubernetes-addons"
  cluster_name    = module.eks.cluster_name
  route53_zone_id = var.route53_zone_id
  email           = var.email
  env             = local.env
}


module "argocd" {
  source          = "./modules/argocd"
  cluster_name    = module.eks.cluster_name
  route53_zone_id = var.route53_zone_id
  email           = var.email
}
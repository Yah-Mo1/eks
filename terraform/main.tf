module "vpc" {
    source = "./modules/vpc"
    vpc_cidr = "10.0.0.0/16"
    env = "dev"
    azs = local.azs
    private_subnets_cidr_blocks = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
    public_subnets_cidr_blocks = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
    private_subnets_tags = {
        "kubernetes.io/role/internal-elb" = "1"
        "kubernetes.io/cluster/${local.env}-${local.cluster_name}" = "owned"
    }
    public_subnets_tags = {
        "kubernetes.io/role/elb" = "1"
        "kubernetes.io/cluster/${local.env}-${local.cluster_name}" = "owned"
    }
}

module "eks" {
    source = "./modules/eks"
    env = local.env
    cluster_name = local.cluster_name
    eks_version = local.eks_version
    capacity_type = local.capacity_type
    instance_types = local.instance_types
    private_subnets_ids = module.vpc.private_subnets_ids
}

// Comment out for now until eks is created
module "kubernetes-addons" {
    source = "./modules/kubernetes-addons"
    cluster_name = module.eks.cluster_name
    route53_zone_id = var.route53_zone_id
}




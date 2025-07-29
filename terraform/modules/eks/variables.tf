variable "env" {
    type = string
    description = "Environment"
}

variable "cluster_name" {
    type = string
    description = "Cluster name"
}

variable "eks_version" {
    type = string
    description = "EKS version"
}

variable "private_subnets_ids" {
    type = list(string)
    description = "Private subnets IDs"
}

variable "instance_types" {
    type = list(string)
    description = "Instance types"
}

variable "capacity_type" {
    type = string
    description = "Capacity type"
}
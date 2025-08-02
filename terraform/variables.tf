variable "route53_zone_id" {
  type        = string
  description = "Route53 zone id"
}
variable "public_subnets_cidr_blocks" {
  type        = list(string)
  description = "The CIDR blocks for the public subnets"
}

variable "private_subnets_cidr_blocks" {
  type        = list(string)
  description = "The CIDR blocks for the private subnets"
}


variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
}

variable "cluster_name" {
  type        = string
  description = "The name of the cluster"
}

variable "email" {
  type        = string
  description = "Email"
}
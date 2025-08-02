variable "env" {
  type        = string
  description = "The environment to deploy to"
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
}

variable "azs" {
  type        = list(string)
  description = "The availability zones to deploy to"
}

variable "public_subnets_cidr_blocks" {
  type        = list(string)
  description = "The CIDR blocks for the public subnets"
}

variable "private_subnets_cidr_blocks" {
  type        = list(string)
  description = "The CIDR blocks for the private subnets"
}

variable "public_subnets_tags" {
  type        = map(any)
  description = "The tags for the public subnets"
}

variable "private_subnets_tags" {
  type        = map(any)
  description = "The tags for the private subnets"
}
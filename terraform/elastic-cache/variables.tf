variable "region" {
  description = "The region to deploy the RDS instances in"
  default = "eu-central-1"
}

variable "env" {
  default = "dev"
}
variable "cluster_id" {
  default = "flsshygn"
}

variable "profile" {}

variable "vpc_id" {}

variable "namespace" {
  default = "flsshygn"
}

variable "name" {
  default  = "session-store"
}
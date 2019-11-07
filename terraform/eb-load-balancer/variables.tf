variable "region" {
  description = "The region to deploy the RDS instances in"
  default = "eu-central-1"
}
variable "env" {
  default = "dev"
}
variable "profile" {}
variable "lb_arn" {}

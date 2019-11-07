variable "region" {
  description = "The region to deploy the RDS instances in"
  default = "eu-central-1"
}
variable "profile" {}

variable "user_name" {
  default  = "roboter-fhpredict"
}
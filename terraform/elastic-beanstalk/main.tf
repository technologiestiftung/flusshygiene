provider "aws" {
  profile = var.profile
  region  = var.region
}

terraform {
  required_version =">= 0.12.0"
}
# terraform {
#   backend "remote" {
#     organization = "flsshygn"

#     workspaces {
#       # name = "test"
#       prefix = "test"
#     }
#   }
# }

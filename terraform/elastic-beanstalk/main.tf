provider "aws" {
  profile = "${var.profile}"
  region  = "${var.region}"
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

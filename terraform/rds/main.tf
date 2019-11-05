provider "aws" {
  profile = "${var.profile}"
  region = "${var.region}"
}
# data "aws_vpc" "vpc" {
#   id = "${var.vpc_id}"
# }

# data "aws_availability_zones" "available" {
#   state = "available"
# }

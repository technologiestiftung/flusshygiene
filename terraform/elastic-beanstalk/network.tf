# module "vpc" {
#   source     = "git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=tags/0.8.0"
#   namespace  = "${var.namespace}"
#   stage      = "${var.stage}"
#   name       = "${var.name}"
#   attributes = "${var.attributes}"
#   tags       = "${var.tags}"
#   delimiter  = "${var.delimiter}"
#   cidr_block = "172.16.0.0/16"
# }


module "subnets" {
  source               = "git::https://github.com/cloudposse/terraform-aws-dynamic-subnets.git?ref=tags/0.16.0"
  availability_zones   = "${var.availability_zones}"
  namespace            = "${var.namespace}"
  stage                = "${var.stage}"
  name                 = "${var.name}"
  attributes           = "${var.attributes}"
  tags                 = "${var.tags}"
  delimiter            = "${var.delimiter}"
  vpc_id               = "${data.aws_vpc.default.id}"
  igw_id               = "${data.aws_internet_gateway.default.id}"
  cidr_block           = "${cidrsubnet(data.aws_vpc.default.cidr_block, 4, 15)}"
  nat_gateway_enabled  = false
  nat_instance_enabled = false
}


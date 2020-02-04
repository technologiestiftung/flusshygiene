# resource "aws_vpc" "main" {
#   cidr_block = "10.0.0.0/16"
#     tags = {
#     name    = "${var.prefix}-${var.name}-${var.env}"
#     project = "flusshygiene"
#   }
# }

data "aws_vpc" "main"{
  id = "${var.vpc_id}"
}
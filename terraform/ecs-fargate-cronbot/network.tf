# resource "aws_subnet" "public" {
#   count                   = "${var.az_count}"
#   cidr_block              = cidrsubnet(data.aws_vpc.main.cidr_block, 8,  count.index)
#   availability_zone       = "${data.aws_availability_zones.available.names[count.index]}"
#   vpc_id                  = "${data.aws_vpc.main.id}"
#   map_public_ip_on_launch = true
#   tags = {
#     name    = "${var.prefix}-${var.name}-${var.env}"
#     project = "flusshygiene"
#   }
# }


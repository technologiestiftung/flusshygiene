

data "aws_security_groups" "default" {

  filter {
    name   = "vpc-id"
    values = ["${var.vpc_id}"]
  }
}


# Create a subnet to launch our instances into
resource "aws_subnet" "default" {
  count                   = 3
  vpc_id                  = "${data.aws_vpc.default.id}"
  availability_zone       = "${data.aws_availability_zones.available.names[count.index]}"
  cidr_block              ="${cidrsubnet(data.aws_vpc.default.cidr_block, 4, 12 + count.index)}"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.namespace}"
  }
}

resource "aws_elasticache_subnet_group" "default" {
  # count = length(aws.subnet.default)
  name       = "${var.namespace}-${var.env}-${var.name}-subnet-group"
  subnet_ids = "${aws_subnet.default.*.id}"
}
# resource "aws_elasticache_subnet_group" "default" {
#   name       = "${var.namespace}-cache-subnet"
#   subnet_ids = "${aws_subnet.default.*.id}"
# }


resource "aws_security_group" "redis" {
  # name_prefix = "${var.namespace}"
  name = "${var.namespace}-${var.env}-${var.name}-sg"
  vpc_id      = "${data.aws_vpc.default.id}"

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    # cidr_blocks = ["0.0.0.0/0"]
    security_groups = "${data.aws_security_groups.default.ids}"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
data "aws_internet_gateway" "default" {
  filter {
    name   = "attachment.vpc-id"
    values = ["${var.vpc_id}"]
  }
}
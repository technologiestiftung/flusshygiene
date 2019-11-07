# we assume you created your cert through acm

data "aws_acm_certificate" "default" {
  domain   = "${var.domain}"
  statuses = ["ISSUED"]
}
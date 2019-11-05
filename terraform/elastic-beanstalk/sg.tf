data "aws_security_group" "default" {
  id = "${var.security_group_id}"
}

# data "aws_security_group" "elastic_cache" {
#   id = "${var.security_group_elastic_cache_id}"
# }

data "aws_security_group" "rds" {
  id = "${var.security_group_rds_id}"
}

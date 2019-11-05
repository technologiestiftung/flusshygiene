data "aws_db_instance" "database" {
  db_instance_identifier = "${var.rds_identifier}"
}

provider "aws" {
  profile = "${var.profile}"
  region  = "${var.region}"
}

resource "aws_cloudwatch_log_group" "elastic_beanstalk" {
  name = "flsshygn"
  tags = {
    project = "flusshygiene"
  }
}
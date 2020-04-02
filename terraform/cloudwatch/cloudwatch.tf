resource "aws_cloudwatch_log_group" "cronbot" {
  name = "flsshygn"
  tags = {
    project = "flusshygiene"
  }
}
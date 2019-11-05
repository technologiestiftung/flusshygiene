resource "aws_ecs_cluster" "radolan_cluster" {
  name = "${var.prefix}-${var.name}-${var.env}"
  tags = {
    name    = "${var.prefix}-${var.name}-${var.env}"
    project = "flusshygiene"
  }
}

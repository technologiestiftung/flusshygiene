# cloudwatch.tf

resource "aws_cloudwatch_event_target" "cw-target" {
  count     = "${var.az_count}"
  rule      = "${aws_cloudwatch_event_rule.cw_rule.name}"
  target_id = "${var.prefix}-${var.name}-${var.env}-every-24-hours"
  # arn       = "${var.cluster_arn}"
  arn      = "${aws_ecs_cluster.radolan_cluster.arn}"
  role_arn = "${aws_iam_role.ecs_events.arn}"

  ecs_target {
    launch_type         = "FARGATE"
    task_count          = 1
    task_definition_arn = "${aws_ecs_task_definition.task.arn}"
    # needs network access
    network_configuration {
      subnets          = ["${aws_subnet.public[count.index].id}"]
      security_groups  = ["${aws_security_group.public-group.id}"]
      assign_public_ip = true
    }
  }
  depends_on = [
    aws_cloudwatch_event_rule.cw_rule,
    aws_ecs_task_definition.task,
    aws_iam_role.ecs_events,aws_ecs_cluster.radolan_cluster,
    aws_security_group.public-group
    ]
}


resource "aws_cloudwatch_event_rule" "cw_rule" {
  name                = "${var.prefix}-${var.name}-${var.env}-rule"
  schedule_expression = "${var.schedule_expression}"
  is_enabled          = true
  tags = {
    name    = "${var.prefix}-${var.name}-${var.env}"
    project = "flusshygiene"
  }
}

data "aws_lb" "default" {
  arn = var.lb_arn
}

data "aws_lb_listener" "default80" {
  load_balancer_arn = data.aws_lb.default.arn
  port              = 80
}

resource "aws_lb_listener_rule" "redirect_http_to_https" {
  listener_arn = data.aws_lb_listener.default80.arn

  action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  # SEE for multiple values https://github.com/terraform-providers/terraform-provider-aws/issues/8266
  condition {
    field = "host-header"

    # values = ["*.flusshygiene.xyz","www.flusshygiene.xyz","flusshygiene.xyz"]
    values = ["*.flussbaden.org"]
  }
}


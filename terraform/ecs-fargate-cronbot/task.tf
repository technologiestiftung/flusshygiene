resource "aws_cloudwatch_log_group" "cronbot" {
  name = "${var.prefix}-${var.name}-${var.env}"
  tags = {
    name    = "${var.prefix}-${var.name}-${var.env}"
    project = "flusshygiene"
  }
}


resource "aws_ecs_task_definition" "task" {

  family                   = "${var.prefix}-${var.name}-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "${aws_iam_role.task_execution_role.arn}"
  # the difinition could also be located in a file
  # container_definitions = "${file("task-definitions/service.json")}"
  container_definitions = <<JSON
 [
  {
"logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "${aws_cloudwatch_log_group.cronbot.name}",
                    "awslogs-region": "${var.region}",
                    "awslogs-stream-prefix": "${var.prefix}"
                }
            },

    "environment": [
      {"name":"ECS_AVAILABLE_LOGGING_DRIVERS",
      "value":"'[\"json-file\",\"awslogs\"]'"
      },
      {
        "name": "MAILGUN_FROM",
        "value": "${var.mailgun_from}"
      },
      {
        "name": "MAILGUN_TO",
        "value": "${var.mailgun_to}"
      },
      {
        "name": "MAILGUN_DOMAIN",
        "value": "${var.mailgun_domain}"
      },
      {
        "name": "MAILGUN_APIKEY",
        "value": "${var.mailgun_api_key}"
      },
      {
        "name": "AUTH0_TOKEN_ISSUER",
        "value": "${var.auth0_token_issuer}"
      },
      {
        "name": "AUTH0_AUDIENCE",
        "value": "${var.auth0_audience}"
      },
      {
        "name": "AUTH0_CLIENT_ID",
        "value": "${var.auth0_client_id}"
      },
      {
        "name": "AUTH0_CLIENT_SECRET",
        "value": "${var.auth0_client_secret}"
      },
      {
        "name": "API_HOST",
        "value": "${var.api_host}"
      },
      {
        "name": "API_VERSION",
        "value": "${var.api_version}"
      },
      {
        "name": "FLSSHYGN_PREDICT_URL",
        "value": "${var.flsshygn_predict_url}"
      },
      {
        "name": "FLSSHYGN_CALIBRATE_URL",
        "value": "${var.flsshygn_calibrate_url}"
      },
      {
        "name":"SMTP_HOST",
        "value": "${var.smtp_host}"
      },
      {
        "name":"SMTP_USER",
        "value": "${var.smtp_user}"
      },
      {
        "name":"SMTP_PW",
        "value": "${var.smtp_pw}"
      },
      {
        "name":"SMTP_PORT",
        "value": "${var.smtp_port}"
      },
      {
        "name":"SMTP_FROM",
        "value": "${var.smtp_from}"
      },
      {
        "name":"SMTP_ADMIN_TO",
        "value": "${var.smtp_admin_to}"
      }
    ],
    "name": "${var.prefix}-${var.name}-${var.env}",
    "image": "${var.image}",
    "cpu": 256,
    "memory": 512,
    "essential": true,
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 80
      }
    ]
  }
]
JSON
  tags = {
    name    = "${var.prefix}-${var.name}-${var.env}"
    project = "flusshygiene"
  }
}

resource "aws_cloudwatch_log_group" "recent" {
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
  cpu                   = "256"
  memory                = "512"
  execution_role_arn    = "${aws_iam_role.task_execution_role.arn}"
  # the difinition could also be located in a file
  # container_definitions = "${file("task-definitions/service.json")}"
  container_definitions = <<JSON
 [
  {
    "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "${aws_cloudwatch_log_group.recent.name}",
                    "awslogs-region": "${var.region}",
                    "awslogs-stream-prefix": "${var.prefix}"
                }
            },
  "environment" : [
    {
       "name": "MAILGUN_FROM",
       "value": "${var.mailgun_from}"
       }, {
       "name": "MAILGUN_TO",
       "value": "${var.mailgun_to}"
       }, {
       "name": "MAILGUN_DOMAIN",
       "value": "${var.mailgun_domain}"
       }, {
       "name": "MAILGUN_APIKEY",
       "value": "${var.mailgun_api_key}"
     }, {
       "name": "AWS_ACCESS_KEY_ID",
       "value": "${var.aws_access_key_id}"
     }, {
       "name": "AWS_SECRET_ACCESS_KEY",
       "value": "${var.aws_secret_access_key}"
     }, {
       "name": "AWS_BUCKET_NAME",
       "value": "${data.aws_s3_bucket.default.id}"
     } , {
       "name": "AWS_REGION",
       "value": "${var.region}"
     }  , {
       "name": "FTP_HOST",
       "value": "${var.ftp_host}"
     }  , {
       "name": "FTP_PORT",
       "value": "${var.ftp_port}"
     }  , {
       "name": "FTP_RADOLAN_PATH",
       "value": "${var.ftp_radolan_path}"
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
    name = "${var.prefix}-${var.name}-${var.env}"
    project = "flusshygiene"
  }
}

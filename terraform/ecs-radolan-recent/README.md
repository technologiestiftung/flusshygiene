# ECS Cluster for scraping recent radolan files

This is a terraform recipe for provisioning a Fargate ECS Cluster that runs a docker container on a schedule. Part of the Flusshygiene project.



## Todo

- [ ] test if we actually need ingress rules?
- [ ] test multiple containers to do rw and sf product
- [ ] use `task_role_arn` on `aws_ecs_task_definition` to not pass credentials into the container as ENV variable [see this](https://www.terraform.io/docs/providers/aws/r/ecs_task_definition.html#task_role_arn)
- [ ] Logging to somewhere






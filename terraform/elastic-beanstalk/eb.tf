module "elastic_beanstalk_application" {
  source                                     = "git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-application.git?ref=tags/0.3.0"
  namespace                                  = "${var.namespace}"
  stage                                      = "${var.stage}"
  name                                       = "${var.name}"
  attributes                                 = "${var.attributes}"
  tags                                       = "${var.tags}"
  delimiter                                  = "${var.delimiter}"
  description                                = "Test elastic_beanstalk_application"
  appversion_lifecycle_max_count             = 60
  appversion_lifecycle_delete_source_from_s3 = true
}


module "elastic_beanstalk_environment" {
  source                     = "git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-environment.git?ref=tags/0.17.0"
  namespace                  = "${var.namespace}"
  stage                      = "${var.stage}"
  name                       = "${var.name}"
  attributes                 = "${var.attributes}"
  tags                       = "${var.tags}"
  delimiter                  = "${var.delimiter}"
  description                = "${var.description}"
  region                     = "${var.region}"
  availability_zone_selector = "${var.availability_zone_selector}"
  # dns_zone_id                = var.dns_zone_id

  wait_for_ready_timeout             = "${var.wait_for_ready_timeout}"
  elastic_beanstalk_application_name = "${module.elastic_beanstalk_application.elastic_beanstalk_application_name}"
  environment_type                   = "${var.environment_type}"
  loadbalancer_type                  = "${var.loadbalancer_type}"
  elb_scheme                         = "${var.elb_scheme}"
  tier                               = "${var.tier}"
  version_label                      = "${var.version_label}"
  force_destroy                      = "${var.force_destroy}"

  instance_type    = "${var.instance_type}"
  root_volume_size = "${var.root_volume_size}"
  root_volume_type = "${var.root_volume_type}"

  autoscale_min             = "${var.autoscale_min}"
  autoscale_max             = "${var.autoscale_max}"
  autoscale_measure_name    = "${var.autoscale_measure_name}"
  autoscale_statistic       = "${var.autoscale_statistic}"
  autoscale_unit            = "${var.autoscale_unit}"
  autoscale_lower_bound     = "${var.autoscale_lower_bound}"
  autoscale_lower_increment = "${var.autoscale_lower_increment}"
  autoscale_upper_bound     = "${var.autoscale_upper_bound}"
  autoscale_upper_increment = "${var.autoscale_upper_increment}"

  loadbalancer_certificate_arn = "${var.ssl_cert_arn}"

  loadbalancer_ssl_policy     = "${var.loadbalancer_ssl_policy}"
  associate_public_ip_address = "${var.associate_public_ip_address}"
  vpc_id                      = "${var.vpc_id}"
  loadbalancer_subnets        = "${module.subnets.public_subnet_ids}"
  application_subnets         = "${module.subnets.public_subnet_ids}"
  # ⤴ should be like the one below for production ⤵
  # application_subnets         = "${module.subnets.private_subnet_ids}"
  allowed_security_groups = ["${data.aws_security_group.default.id}", "${data.aws_security_group.rds.id}"]

  rolling_update_enabled  = "${var.rolling_update_enabled}"
  rolling_update_type     = "${var.rolling_update_type}"
  updating_min_in_service = "${var.updating_min_in_service}"
  updating_max_batch      = "${var.updating_max_batch}"

  healthcheck_url  = "${var.healthcheck_url}"
  application_port = "${var.application_port}"

  enable_stream_logs   = "${var.enable_stream_logs}"
  ssh_listener_enabled = "${var.ssh_listener_enabled}"

  // https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html
  // https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.docker
  solution_stack_name = "${var.solution_stack_name}"

  additional_settings = "${var.additional_settings}"
  env_vars = merge({

    API_URL = "${var.current_host}",
    # API_URL = "${module.elastic_beanstalk_environment.endpoint}/api/v1/",
    OCPU_API_HOST_DEV = "${var.current_host}",
    # OCPU_API_HOST_DEV = "${module.elastic_beanstalk_environment.endpoint}",
    OCPU_API_HOST_PROD = "${var.current_host}",
    # OCPU_API_HOST_PROD = "${module.elastic_beanstalk_environment.endpoint}",
    # used by middlelayer for CORS
    APP_HOST_1 = "${var.current_host}",
    APP_HOST_2 = "https://www.flusshygiene.xyz",
    # APP_HOST_1 = "${module.elastic_beanstalk_environment.endpoint}",
    # APP_HOST_2 = "${module.elastic_beanstalk_environment.endpoint}",

    # used for uploads
    AWS_BUCKET_DEV  = "${data.aws_s3_bucket.upload.id}",
    AWS_BUCKET_PROD = "${data.aws_s3_bucket.upload.id}",
    # the postgres DB infos
    PG_HOST_DEV        = "${data.aws_db_instance.database.address}",
    PG_HOST_DEV_DOCKER = "${data.aws_db_instance.database.address}",
    PG_HOST_PROD       = "${data.aws_db_instance.database.address}",
    # the elastic cache infos
    REDIS_HOST_DEV  = "${data.aws_elasticache_cluster.default.cache_nodes.0.address}",
    REDIS_HOST_PROD = "${data.aws_elasticache_cluster.default.cache_nodes.0.address}",
  }, var.env_vars)
}

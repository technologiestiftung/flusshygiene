variable "profile" {
  description = "The profile to work with. See your ~/.aws/credentials"
  default     = "default"
}

variable "region" {
  description = "The region to work in."
  default     = "eu-central-1"
}
variable "rand_id" {

default="123456"
}
variable "prefix" {
  description = "A name prefix added to all resources created"
  default     = "tf"
}

variable "name" {
  description = "The name of resources created"
  default     = "cronbot"
}

variable "env" {
  description = "Just another suffix so you can have environments"
  default     = "dev"
}
variable "availability_zones" {
  description = "I Think there are only 3 in europe"
  default     = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}
variable "az_count" {
  description = "Number of Availability Zones (AZs) to cover in a given region"
  default     = "3"
}
variable "vpc_id" {
  description = "The ID of your existing VPC where all the groups will be created in"
}
variable "subnets" {
  description = "List of subnets to create the container in"

}
variable "image" {
  description = "the image to use for your task"
  default     = "technologiestiftung/flusshygiene-cronbot:latest"
}

# variable "cluster_arn" {
#   description = "If you have a clsuter. You could use the cluster arn"
# }

variable "schedule_expression" {
  description = "The schedule to run in. Could also be cron(*/5 * * * *) see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html"
  default     = "cron(0 8 * * ? *)"
  # every five minutes
  # default     = "cron(*/3 * * * ? *)"
}



# ┌─┐┌┐┌┬  ┬
# ├┤ │││└┐┌┘
# └─┘┘└┘ └┘
# ┬  ┬┌─┐┬─┐┬┌─┐┌┐ ┬  ┌─┐┌─┐
# └┐┌┘├─┤├┬┘│├─┤├┴┐│  ├┤ └─┐
#  └┘ ┴ ┴┴└─┴┴ ┴└─┘┴─┘└─┘└─┘
# Mailgun
# variable "mailgun_domain" {
#   type = string

# }

# variable "mailgun_from" {
#   type = string
# }

# variable "mailgun_to" {
#   type = string
# }

# variable "mailgun_api_key" {
#   type = string
# }

variable "auth0_token_issuer" {
  type = string
}
variable "auth0_audience" {
  type = string
}
variable "auth0_client_id" {
  type = string
}
variable "auth0_client_secret" {
  type = string
}
variable "api_host" {
  type = string
}
variable "api_version" {
  type = string
}
variable "flsshygn_predict_url" {
  type = string
}
variable "flsshygn_calibrate_url" {
  type = string
}

variable "smtp_host" {
  type = string
}
variable "smtp_user" {
  type = string
}
variable "smtp_pw" {
  type = string
}
variable "smtp_port" {
  type = string
}
variable "smtp_from" {
  type = string
}
variable "smtp_admin_to" {
  type = string
}

variable "region" {
  description = "The region we are on"
}
variable "profile" {
  description = "The profile to use"
}

variable "prefix" {
  description = "prefix for names"
  default     = "flsshygn"
}

variable "env" {
  default = "dev"
}


variable "allowed_origins" {

  type = list
}

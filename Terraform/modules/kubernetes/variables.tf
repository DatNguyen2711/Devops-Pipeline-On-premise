variable "imnage_pull_secret" {
  type        = string
  default     = "my-dockerhub-secret"
}


variable "namespace" {
  type        = string
  default     = "pharmacy-app"
}



variable "deployment_config_backend" {
  description = "Configuration for the Kubernetes deployment"
  type = object({
    name           = string
    namespace      = string
    component      = string
    replicas       = number
    container_name = string
    image          = string
    container_port = number
    port_name      = string
    resources = object({
      requests = object({
        cpu    = string
        memory = string
      })
      limits = object({
        cpu    = string
        memory = string
      })
    })
    image_pull_secret_name = string
    docker_config_json     = string
  })
}
variable "deployment_config_frontend" {
  description = "Configuration for the Kubernetes deployment"
  type = object({
    name           = string
    namespace      = string
    component      = string
    replicas       = number
    container_name = string
    image          = string
    container_port = number
    port_name      = string
    resources = object({
      requests = object({
        cpu    = string
        memory = string
      })
      limits = object({
        cpu    = string
        memory = string
      })
    })
    liveness_probe = object({
      path                  = string
      port                  = string
      initial_delay_seconds = number
      period_seconds        = number
      failure_threshold     = number
    })
    readiness_probe = object({
      path                  = string
      port                  = string
      initial_delay_seconds = number
      period_seconds        = number
      failure_threshold     = number
    })
    image_pull_secret_name = string
    docker_config_json     = string
  })
}

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

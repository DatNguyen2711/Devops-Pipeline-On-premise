variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}

variable "deployment_config" {
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
  default = {
    name           = "back-end"
    namespace      = "pharmacy-app"
    component      = "back-end"
    replicas       = 3
    container_name = "back-end"
    image          = "datnd2711/pharmacy-be:v3"
    container_port = 8080
    port_name      = "http-backend"
    resources = {
      requests = {
        cpu    = "250m"
        memory = "256Mi"
      }
      limits = {
        cpu    = "500m"
        memory = "512Mi"
      }
    }
    image_pull_secret_name = "my-dockerhub-secret"
    docker_config_json     = "/path/to/.docker/config.json"
  }
}

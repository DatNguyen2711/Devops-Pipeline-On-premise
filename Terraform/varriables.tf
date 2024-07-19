variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}
variable "deployment_config_frontend" {
  description = "Configuration for the frontend Kubernetes deployment"
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
  })
  default = {
    name           = "front-end"
    namespace      = "pharmacy-app"
    component      = "front-end"
    replicas       = 2
    container_name = "front-end"
    image          = "datnd2711/pharmacy-fe:v5"
    container_port = 80
    port_name      = "http-frontend"
    resources = {
      requests = {
        cpu    = "100m"
        memory = "128Mi"
      }
      limits = {
        cpu    = "200m"
        memory = "256Mi"
      }
    }
    liveness_probe = {
      path                  = "/"
      port                  = "http-frontend"
      initial_delay_seconds = 30
      period_seconds        = 10
      failure_threshold     = 3
    }
    readiness_probe = {
      path                  = "/"
      port                  = "http-frontend"
      initial_delay_seconds = 15
      period_seconds        = 5
      failure_threshold     = 3
    }
    image_pull_secret_name = "my-dockerhub-secret"
  }
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
  }
}

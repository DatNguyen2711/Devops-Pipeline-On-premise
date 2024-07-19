output "namespace" {
  description = "The namespace of the deployment"
  value       = kubernetes_deployment.backend.metadata[0].namespace
}
output "backend_deployment_name" {
  description = "The name of the BE deployment"
  value       = kubernetes_deployment.backend.metadata[0].name
}

output "frontend_deployment_name" {
  description = "The name of the FE deployment"
  value       = kubernetes_deployment.frontend.metadata[0].name
}
output "sqlserver_statefulset_name" {
  description = "The name of the DB statefulset"

  value = kubernetes_stateful_set.sqlserver.metadata[0].name
}

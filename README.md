# ☁️ AWS EKS Infrastructure with Terraform and Helm

This project provisions a secure, production-ready Kubernetes environment on **Amazon EKS**, configured using **Terraform** and extended with **Helm charts** for Kubernetes add-ons including:

- **cert-manager** for automatic TLS certificates
- **ExternalDNS** for automated DNS management via Route 53
- **NGINX Ingress Controller** for routing external traffic

---

## 🏗️ Infrastructure Overview

### ✅ EKS Cluster

Provisioned using the [terraform-aws-modules/eks/aws](https://github.com/terraform-aws-modules/terraform-aws-eks) module with:

- **Kubernetes version**: `1.31`
- **IRSA enabled** for IAM roles per service account
- **Public and private endpoint configuration**
- **Managed node group** using `t3.large` and `t3a.large` EC2 instances
- **Private subnets** for workloads and **public subnets** for control plane access

### ✅ VPC

Provisioned with the [terraform-aws-modules/vpc/aws](https://github.com/terraform-aws-modules/terraform-aws-vpc) module:

- CIDR block: `10.0.0.0/16`
- 3 private and 3 public subnets across multiple AZs
- Single NAT Gateway for internet access from private subnets
- Public/private subnet tagging for EKS discovery

---

## 🔒 IAM Roles for Service Accounts (IRSA)

Configured using the [terraform-aws-modules/iam/aws](https://github.com/terraform-aws-modules/terraform-aws-iam) module:

### `cert-manager` IRSA

- Grants access to specific Route 53 Hosted Zone (`Z02921172XJD0IEJNFBH7`) for DNS01 ACME challenges

### `external-dns` IRSA

- Grants scoped access to manage Route 53 records for the same zone

---

## ⚙️ Helm Deployments

### 📦 `nginx-ingress`

- Installed via Helm chart from [NGINX's stable repository](https://helm.nginx.com/stable)
- Deployed into `nginx-ingress` namespace

### 🔐 `cert-manager`

- Installed from [Jetstack Helm repo](https://charts.jetstack.io)
- Configured to install CRDs
- Values loaded from `helm-values/cert-manager.yaml`

### 🌐 `external-dns`

- Installed from Bitnami’s OCI Helm repo
- Uses IRSA IAM role
- Automatically syncs Kubernetes Ingress hostnames with Route 53 DNS records
- Values loaded from `helm-values/external-dns.yaml`

---

## 🧰 Tools Used

| Tool / Service | Purpose                                  |
| -------------- | ---------------------------------------- |
| Terraform      | Infrastructure as Code                   |
| AWS EKS        | Kubernetes control plane                 |
| IAM (IRSA)     | Secure pod-level AWS permissions         |
| VPC Module     | Networking and subnet provisioning       |
| Helm           | Kubernetes package manager               |
| cert-manager   | TLS via Let’s Encrypt (DNS-01 challenge) |
| ExternalDNS    | Route 53 DNS automation                  |
| nginx-ingress  | Ingress controller for routing traffic   |

---

## 📈 Outcome

- Fully automated, production-ready EKS setup using Terraform
- Secure and scalable architecture with public ingress and private workloads
- Live TLS-enabled applications with domain name automation

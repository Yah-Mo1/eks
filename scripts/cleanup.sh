#!/bin/bash


# Delete all helm releases
helm uninstall argocd -n argocd
helm uninstall cert-manager -n cert-manager
helm uninstall external-dns -n external-dns
helm uninstall nginx-ingress -n ingress-nginx
helm uninstall dev-eks-cluster-autoscaler -n kube-system
helm uninstall metrics-server -n kube-system



# Delete ArgoCD releated CRDs
kubectl delete crd applications.argoproj.io \
              applicationsets.argoproj.io \
              appprojects.argoproj.io \
              appresources.argoproj.io \
              appresourcesets.argoproj.io \
              appresourcepolicies.argoproj.io \
              appresourcepoliciesets.argoproj.io \
              appresourcepoliciesets.argoproj.io \

# Delete Cert-Manager releated CRDs
kubectl delete crd issuers.cert-manager.io \
              certificates.cert-manager.io \
              challenges.acme.cert-manager.io \
              clusterissuers.cert-manager.io \
              orders.acme.cert-manager.io \
              certificates.cert-manager.io \
              challenges.acme.cert-manager.io \
              clusterissuers.cert-manager.io \
              orders.acme.cert-manager.io \

# Delete namespaces
kubectl delete namespace argocd \
              cert-manager \
              external-dns \
              ingress-nginx \
              nginx-namespace

# Delete all resources in the namespace
kubectl delete all --all -n argocd
# Coolify Deployment Guide

This guide outlines how to deploy Seward Mupereri's personal portfolio website to your self-hosted **Coolify** server under the custom domain **`sewardmupereri.banyalabs.com`**.

---

## 📋 Prerequisites

1. **Coolify Instance**: Running on your server (e.g., Hetzner VPS).
2. **DNS Configuration**: Access to domain DNS management for `banyalabs.com`.
3. **Git Repository**: Pushed code to GitHub/GitLab repository (`sewardrichard/portfolio`).

---

## 🌐 Step 1: Configure DNS Records

In your DNS provider (e.g., Cloudflare, Hetzner DNS, Namecheap) for `banyalabs.com`:

| Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `sewardmupereri` | `<YOUR_SERVER_PUBLIC_IP>` | Auto / 300s |
| *(or CNAME)* | `sewardmupereri` | `coolify.banyalabs.com` | Auto / 300s |

---

## 🚀 Step 2: Deploy Application in Coolify

### 1. Add New Resource
1. Log in to your Coolify dashboard (`https://coolify.banyalabs.com` or your Coolify IP).
2. Select your **Project** and **Environment** (e.g., `Production`).
3. Click **+ Add Resource** → **Public Repository** (or **Private Repository** if repo is private).

### 2. Connect Repository
- **Repository URL**: `https://github.com/sewardrichard/portfolio`
- **Branch**: `main`
- **Build Pack**: Select **Dockerfile** (Coolify will automatically pick up the included `Dockerfile` and `nginx.conf`).

### 3. Configure Domain & Network
- **FQDN (Domains)**: Set to `https://sewardmupereri.banyalabs.com`
- **Port**: `80` (automatically exposed by Dockerfile).
- **SSL / HTTPS**: Coolify will automatically provision a free Let's Encrypt SSL certificate once DNS resolves.

### 4. Deploy
- Click **Deploy**.
- Monitor the deployment log.
- Upon completion, your site will be live at:
  👉 **`https://sewardmupereri.banyalabs.com`**

---

## 🛠️ Coolify CLI / MCP Quick Verification

If using Coolify API or Coolify MCP server:
```bash
# List applications
coolify app list

# Trigger manual deployment via webhook / API
curl -X POST "https://coolify.banyalabs.com/api/v1/deploy?uuid=<APP_UUID>" -H "Authorization: Bearer <COOLIFY_API_TOKEN>"
```

---

## 🔒 Verification Checklist

- [x] SSL Certificate provisioned (`https://sewardmupereri.banyalabs.com`)
- [x] HTML partial fetches loading without CORS errors
- [x] Projects filtering and coverflow rendering properly
- [x] Contact links pointing to email & LinkedIn
- [x] Banya Labs banner linking to `https://banyalabs.com`

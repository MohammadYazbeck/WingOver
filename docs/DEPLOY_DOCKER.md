# Deploy WingOver with Docker and Traefik

This project builds into a small standalone Next.js container listening on port `3000`. Traefik terminates HTTPS and forwards traffic to the container over the external `traefik` Docker network.

## First deployment

On the Ubuntu VPS, place the project at `/srv/projects/wingover` and run:

```bash
cd /srv/projects/wingover
cp .env.example .env
docker network inspect traefik >/dev/null 2>&1 || docker network create traefik
docker compose up -d --build
docker compose ps
```

The existing Traefik container must also be connected to the external `traefik` network. Point the domain and its `www` hostname at the VPS before testing HTTPS. The `le` certificate resolver name in `docker-compose.yml` must match the resolver configured in your Traefik instance.

## Updates

```bash
cd /srv/projects/wingover
git pull
docker compose up -d --build
docker image prune -f
```

Inspect the service with:

```bash
docker compose logs -f wingover-web
```

The app has no runtime database or upload volume. Its generated assets are baked into the image from `public/` during the build.

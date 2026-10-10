#!/usr/bin/env bash
# Installs (or updates) Uniq on a fresh Ubuntu server: Supabase, the website, the video worker and HTTPS.
#
#   curl -fsSL https://raw.githubusercontent.com/stlgvn/stani_flms/master/deploy/install.sh | bash
#   curl -fsSL …/install.sh | bash -s -- uniq.stlgv.com      # with your own domain
#
# Without a domain the site is served at https://<ip-with-dashes>.sslip.io.
# Re-running the same command later updates the app and keeps all data and keys.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/stlgvn/stani_flms}"
APP_DIR="${APP_DIR:-/opt/stani_flms}"
SB_DIR="${SB_DIR:-/opt/supabase}"
SCHEME="${SCHEME:-https}"          # http only for local testing
SKIP_DEPS="${SKIP_DEPS:-0}"
SKIP_FIREWALL="${SKIP_FIREWALL:-0}"
NO_BUILD="${NO_BUILD:-0}"           # testing only: reuse an already built uniq-app image
DOMAIN="${1:-${DOMAIN:-}}"

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" = "0" ] || die "Run as root (log in as root, or use sudo)."

if [ "$SKIP_DEPS" != "1" ]; then
  log "Installing system packages"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -qq -y git curl ca-certificates openssl jq ufw >/dev/null
fi

if [ -z "$DOMAIN" ]; then
  IP="$(curl -4 -fsS --max-time 10 https://api.ipify.org || hostname -I | awk '{print $1}')"
  DOMAIN="${IP//./-}.sslip.io"
fi
SITE="${SCHEME}://${DOMAIN}"
log "Site address: ${SITE}"

log "Getting the app code"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch -q origin && git -C "$APP_DIR" reset -q --hard origin/HEAD
else
  git clone -q "$REPO_URL" "$APP_DIR"
fi

if [ ! -f "$SB_DIR/.env" ]; then
  log "Setting up Supabase (database, auth, storage) — first run takes a few minutes"
  mkdir -p "$(dirname "$SB_DIR")"
  curl -fsSL https://raw.githubusercontent.com/supabase/supabase/master/docker/setup.sh -o /tmp/supabase-setup.sh
  setup_args=(-y --project-dir "$(basename "$SB_DIR")")
  [ "$SKIP_DEPS" = "1" ] && setup_args+=(--skip-deps)
  # Its output contains the generated secrets, so it goes to a root-only log instead of the screen.
  install -m 600 /dev/null /root/supabase-setup.log
  (cd "$(dirname "$SB_DIR")" && sh /tmp/supabase-setup.sh "${setup_args[@]}") >>/root/supabase-setup.log 2>&1 \
    || die "Supabase setup failed — see /root/supabase-setup.log"
  chmod 600 "$SB_DIR/.env"
fi
command -v docker >/dev/null || die "Docker is not installed."

# Set KEY=VALUE in Supabase's .env, replacing the line if it exists.
set_env() {
  local file="$SB_DIR/.env" key="$1" value="$2"
  if grep -q "^${key}=" "$file"; then
    local tmp; tmp="$(mktemp)"
    awk -v k="$key" -v v="$value" 'BEGIN{FS=OFS="="} $1==k {print k "=" v; next} {print}' "$file" >"$tmp"
    cat "$tmp" >"$file" && rm -f "$tmp"
  else
    printf '%s=%s\n' "$key" "$value" >>"$file"
  fi
}
# Keep a value that is already set (e.g. Stripe keys added by hand).
keep_env() { grep -q "^$1=" "$SB_DIR/.env" || set_env "$1" "${2:-}"; }

log "Configuring"
if [ "$SCHEME" = "https" ]; then PROXY_DOMAIN="$DOMAIN"; else PROXY_DOMAIN="$SITE"; fi
set_env SUPABASE_PUBLIC_URL "$SITE"
set_env API_EXTERNAL_URL "$SITE/auth/v1"
set_env SITE_URL "$SITE"
set_env ADDITIONAL_REDIRECT_URLS "$SITE/auth/confirm"
set_env PROXY_DOMAIN "$PROXY_DOMAIN"
# Until a real email provider is configured (SMTP_HOST still points at the placeholder),
# accounts are confirmed instantly so sign-up works without sending email.
if grep -q '^SMTP_HOST=supabase-mail' "$SB_DIR/.env"; then
  set_env ENABLE_EMAIL_AUTOCONFIRM true
fi
set_env ENABLE_ANONYMOUS_USERS false
set_env APP_DIR "$APP_DIR"
set_env COMPOSE_FILE "docker-compose.yml:$APP_DIR/deploy/docker-compose.uniq.yml"
keep_env STRIPE_SECRET_KEY ""
keep_env STRIPE_WEBHOOK_SECRET ""

log "Building and starting everything (5–10 minutes the first time)"
cd "$SB_DIR"
if [ "$NO_BUILD" = "1" ]; then build_flag=--no-build; else build_flag=--build; fi
docker compose up -d "$build_flag" --remove-orphans

log "Waiting for the database and storage"
for i in $(seq 1 90); do
  if docker compose ps --format '{{.Service}} {{.Health}}' | grep -E '^(db|storage|auth) ' | grep -vq healthy; then
    sleep 5
  else
    break
  fi
  [ "$i" = 90 ] && die "Services did not become healthy. Check: cd $SB_DIR && docker compose ps"
done

log "Applying database migrations"
psql_db() { docker compose exec -T db psql -v ON_ERROR_STOP=1 -q -U supabase_admin -d postgres "$@"; }
psql_db -c "create schema if not exists uniq_internal; create table if not exists uniq_internal.migrations (name text primary key, applied_at timestamptz not null default now());"
for f in "$APP_DIR"/supabase/migrations/*.sql; do
  name="$(basename "$f")"
  if [ -z "$(psql_db -tA -c "select 1 from uniq_internal.migrations where name = '$name'")" ]; then
    echo "  $name"
    { cat "$f"; echo; echo "insert into uniq_internal.migrations (name) values ('$name');"; } | psql_db -1
  fi
done
docker compose restart rest >/dev/null # reload the API schema cache

if [ "$SKIP_FIREWALL" != "1" ]; then
  log "Firewall: allowing only SSH, HTTP and HTTPS"
  ufw allow OpenSSH >/dev/null
  ufw allow 80/tcp >/dev/null
  ufw allow 443 >/dev/null
  ufw --force enable >/dev/null
fi

log "Done!"
cat <<EOF

  Your site:  ${SITE}

  (The HTTPS certificate is issued on the first visit — if the page doesn't open
   right away, wait a minute and refresh.)

  Update later: run the same install command again.
  Logs:         cd $SB_DIR && docker compose logs -f web worker
  Settings:     $SB_DIR/.env   (Stripe keys go here, then: cd $SB_DIR && docker compose up -d)

EOF

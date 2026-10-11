#!/usr/bin/env bash
# Installs (or updates) Uniq on a fresh Ubuntu server: Supabase, the website, the video worker and HTTPS.
#
#   curl -fsSL https://raw.githubusercontent.com/stlgvn/stani_flms/master/deploy/install.sh | bash
#   curl -fsSL …/install.sh | bash -s -- uniq.stlgv.com      # with your own domain
#
# Without a domain the site is served at https://<ip-with-dashes>.sslip.io.
# Re-running the same command later updates the app and keeps all data and keys.
set -euo pipefail

main() {

REPO_URL="${REPO_URL:-https://github.com/stlgvn/stani_flms}"
APP_DIR="${APP_DIR:-/opt/stani_flms}"
SB_DIR="${SB_DIR:-/opt/supabase}"
SCHEME="${SCHEME:-https}"          # http only for local testing
SKIP_DEPS="${SKIP_DEPS:-0}"
SKIP_FIREWALL="${SKIP_FIREWALL:-0}"
NO_BUILD="${NO_BUILD:-0}"           # testing only: reuse an already built uniq-app image
DOMAIN="${1:-${DOMAIN:-}}"
SET_STRIPE="${SET_STRIPE:-0}"       # 1 = ask for the Stripe keys in the terminal (input is hidden)

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" = "0" ] || die "Run as root (log in as root, or use sudo)."

if [ "$SKIP_DEPS" != "1" ]; then
  log "Installing system packages"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -qq -y git curl ca-certificates openssl jq ufw >/dev/null
fi

IP="$(curl -4 -fsS --max-time 10 https://api.ipify.org || hostname -I | awk '{print $1}')"
# Updates keep the domain set on an earlier run.
if [ -z "$DOMAIN" ] && [ "$SCHEME" = "https" ] && [ -f "$SB_DIR/.env" ]; then
  DOMAIN="$(sed -n 's/^PROXY_DOMAIN=//p' "$SB_DIR/.env" | head -1)"
fi
if [ -z "$DOMAIN" ]; then
  DOMAIN="${IP//./-}.sslip.io"
fi
# A real domain must point at this server first, otherwise HTTPS cannot be set up.
if [ "$SCHEME" = "https" ] && [[ "$DOMAIN" != *.sslip.io ]]; then
  RESOLVED="$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}')"
  [ "$RESOLVED" = "$IP" ] || die "$DOMAIN points to '${RESOLVED:-nothing}', not to this server ($IP). Add an A record: $DOMAIN -> $IP, wait 5-30 minutes and run this again."
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
if [ "$SET_STRIPE" = "1" ]; then
  log "Stripe keys (what you paste stays hidden; press Enter to keep the current value)"
  # Pasted values often carry stray spaces or line breaks; drop them.
  read -rsp "Secret key (sk_live_... or sk_test_...): " sk </dev/tty; echo
  sk="$(printf '%s' "$sk" | tr -d '[:space:]')"
  if [ -n "$sk" ]; then
    case "$sk" in
      sk_*|rk_*) set_env STRIPE_SECRET_KEY "$sk"; echo "  OK: secret key saved (${sk:0:8}...)" ;;
      pk_*) die "That is the Publishable key (pk_...). Copy the Secret key (sk_live_...) from Developers > API keys and run this again." ;;
      *) die "A Stripe secret key starts with sk_live_ (yours starts with '${sk:0:3}'). Run this again and paste the Secret key." ;;
    esac
  fi
  read -rsp "Webhook signing secret (whsec_...): " wh </dev/tty; echo
  wh="$(printf '%s' "$wh" | tr -d '[:space:]')"
  if [ -n "$wh" ]; then
    case "$wh" in
      whsec_*) set_env STRIPE_WEBHOOK_SECRET "$wh"; echo "  OK: webhook secret saved (${wh:0:9}...)" ;;
      *) die "A webhook signing secret starts with whsec_ (yours starts with '${wh:0:3}'). Run this again." ;;
    esac
  fi
  unset sk wh
fi

# Supabase's gateway cuts every storage request after 30 seconds in total, which kills
# video uploads and downloads on anything but a very fast connection. Lift that limit
# for the storage route only (stalled transfers are still closed after 5 idle minutes).
gw_patched=0
LDS="$SB_DIR/volumes/api/envoy/lds.template.yaml"
if [ -f "$LDS" ] && [[ "$(sed -n '/prefix: \/storage\/v1\//,/timeout:/p' "$LDS")" == *"timeout: 30s"* ]]; then
  sed -i '/prefix: \/storage\/v1\//,/timeout:/ s/timeout: 30s$/timeout: 0s/' "$LDS"
  gw_patched=1
fi

# BBR keeps downloads fast over long distances; Caddy uses it when the kernel has it.
modprobe tcp_bbr 2>/dev/null || true
if grep -qw bbr /proc/sys/net/ipv4/tcp_available_congestion_control 2>/dev/null; then
  echo tcp_bbr >/etc/modules-load.d/uniq-bbr.conf
  set_env TCP_CONGESTION bbr
fi

log "Building and starting everything (5–10 minutes the first time)"
cd "$SB_DIR"
if [ "$NO_BUILD" = "1" ]; then build_flag=--no-build; else build_flag=--build; fi
docker compose up -d "$build_flag" --remove-orphans </dev/null
[ "$gw_patched" = 1 ] && docker compose restart api-gw >/dev/null </dev/null
# The Caddyfile is mounted as a file, so an updated copy is only picked up on restart.
docker compose restart caddy >/dev/null </dev/null

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
# The script itself may arrive on stdin (curl | bash), so commands that don't need input get /dev/null.
psql_cmd() { psql_db "$@" </dev/null; }
psql_cmd -c "create schema if not exists uniq_internal; create table if not exists uniq_internal.migrations (name text primary key, applied_at timestamptz not null default now());"
for f in "$APP_DIR"/supabase/migrations/*.sql; do
  name="$(basename "$f")"
  if [ -z "$(psql_cmd -tA -c "select 1 from uniq_internal.migrations where name = '$name'")" ]; then
    echo "  $name"
    { cat "$f"; echo; echo "insert into uniq_internal.migrations (name) values ('$name');"; } | psql_db -1
  fi
done
docker compose restart rest >/dev/null </dev/null # reload the API schema cache

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
}

main "$@"

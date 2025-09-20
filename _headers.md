# Set these via Cloudflare Transform Rules → Response Header Modify

# Content-Security-Policy
default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self' https: data: blob:;
font-src 'self' https: data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
form-action 'self';
upgrade-insecure-requests;

# Strict-Transport-Security
max-age=31536000; includeSubDomains; preload

# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
# X-Frame-Options: DENY
# Cross-Origin-Opener-Policy: same-origin
# Cross-Origin-Resource-Policy: same-origin

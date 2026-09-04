#!/usr/bin/env python3
"""Static file server that listens on IPv4 and IPv6 (preview proxies use ::1)."""
import http.server
import os
import socket
import socketserver

PORT = int(os.environ.get("PORT", "43211"))
ROOT = os.path.dirname(os.path.abspath(__file__))


class DualStackServer(socketserver.ThreadingTCPServer):
    address_family = socket.AF_INET6
    allow_reuse_address = True
    daemon_threads = True

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


os.chdir(ROOT)
httpd = DualStackServer(("::", PORT), http.server.SimpleHTTPRequestHandler)
print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/", flush=True)
httpd.serve_forever()

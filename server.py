#!/usr/bin/env python3
"""
简单的 HTTP 服务器，用于本地测试
运行: python3 server.py
访问: http://localhost:8000
"""

import http.server
import socketserver
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 CORS 头
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✅ 服务器启动在 http://localhost:{PORT}")
    print(f"按 Ctrl+C 停止服务器")
    httpd.serve_forever()

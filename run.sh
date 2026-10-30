#!/bin/bash
cd "$(dirname "$0")"
while true; do node server.js >>/tmp/hk.log 2>&1; echo "restart $(date)" >>/tmp/hk.log; sleep 1; done

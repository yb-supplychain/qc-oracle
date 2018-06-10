#!/bin/bash

port=${1:-8082}

curl -H "Content-Type: application/json" \
    -X POST "http://localhost:$port/device"

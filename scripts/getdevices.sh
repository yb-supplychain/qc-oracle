#!/bin/bash

port=${1:-8082}

curl "http://localhost:$port/devices"

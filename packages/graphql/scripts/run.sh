#!/bin/bash

whoami
echo "Running Server"
pnpm build:lib
pnpm db:setup
pnpm db:migrate
pnpm server:start

#!/bin/bash
ls
npm run build
npm run generate
npm run db:migrate
npm run db:seed

exec npm run dev
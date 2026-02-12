#!/bin/sh
echo "====== Сборка проекта ======" &&
vite build &&
echo "\e[31m====== Очистка директории перед заливкой ======\e[0m"
ssh scronheim@dark-corner.ru -p 1488 rmdir --ignore-fail-on-non-empty /mnt/data/ma-frontend
echo "====== Заливка файлов ======"
scp -prq -P 1488 ./dist/* scronheim@dark-corner.ru:/mnt/data/ma-frontend
echo "\e[32m====== Заливка файлов завершена ======\e[0m"
wait &&
echo "====== Удаление сборочных артефактов ======" &&
rm -r ./dist

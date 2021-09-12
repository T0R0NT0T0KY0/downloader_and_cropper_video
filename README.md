# Программа для загрузки видео на minio 
`(in developing)`
`for liga dostizheny`
### Для запуска программы:
 - В переменные окружения указать
```
FILEPATH=filepath/filename.xlsx
MINIO_ENDPOINT=example.com
MINIO_PORT=443
MINIO_USE_SSL=1
MINIO_ACCESS_KEY=accesskey
MINIO_SECRET_KEY=secretkey
MINIO_BUCKET=buket
MINIO_OPATH=path_in_minio_to_save_file
```
 - [скачать ffmpeg и установить в переменные среды](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
    
    
### Порядок действий программы:
- Парсит exel файл `(+)`
- находит ссылки на youtube для скачивания в exel `(+)`
- Скачивает видео `(+)`
- обрезает по параметрам в xel `(+)`
- загружает на minio `(+)`
### для разработки:
- npm i (install) установить зависимости
- npm run dev для разработки используя nodemon
- npm run start для обычного запуска программы

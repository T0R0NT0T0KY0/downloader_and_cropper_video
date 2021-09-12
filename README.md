# Программа для загрузки видео на minio 
`(in developing)`
`for liga dostizheny`
### Для запуска программы:
 - В переменные окружения указать
```
FILEPATH=filepath/filename.xlsx
```
 - [скачать ffmpeg и установить в переменные среды](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
    
    
### Порядок действий программы:
- Парсит exel файл `(+)`
- находит ссылки на youtube для скачивания в exel `(+)`
- Скачивает видео `(+)`
- обрезает по параметрам в xel
- загружает на minio
### для разработки:
- npm i (install) установить зависимости
- npm run dev для разработки используя nodemon
- npm run start для обычного запуска программы

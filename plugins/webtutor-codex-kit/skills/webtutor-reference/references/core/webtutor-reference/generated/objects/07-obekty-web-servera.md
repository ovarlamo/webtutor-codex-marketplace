# Объекты Web-сервера

Источник категории: [docs.datex.ru](http://docs.datex.ru/article.htm?id=5665465792879477233).

Карточек: 3.

| Имя | Краткое описание | Связанные элементы карточки | Источник |
|---|---|---|---|
| `Request` | Объект Request доступен на сервере xHttp.exe при вызове кода веб-страницы. Обозначает соответствующий HTTP-запрос к странице. | `AllSessions`, `AuthLogin`, `AuthObject`, `AuthPassword`, `AuthUserID`, `Body`, `Form`, `Header`, `Method`, `Query`, `QueryString`, `RemoteIP`, `RespContentType`, `RespStream`, `Session`, `Url`, `UrlHost`, `UrlParam`, `UrlPath`, `AddRespHeader()`, … (+9) | [карточка](http://docs.datex.ru/article.htm?id=5665465792879477229) |
| `Response` | Объект Response доступен на сервере xHttp.exe при вызове кода веб-страницы. Обозначает ответ сервера к соответствующему HTTP-запросу к странице. | `ContentType`, `OrigRequest`, `Stream`, `WriteMode`, `AddHeader()`, `CheckModified()`, `HandleStaticFile()`, `Redirect()`, `SetRespStatus()`, `SetWrongAuth()`, `Write()`, `WriteBinary()` | [карточка](http://docs.datex.ru/article.htm?id=5620276905286592689) |
| `Session` | Объект Session доступен на сервере xHttp.exe при вызове кода веб-страницы через одноименную переменную. Обозначает сессию, сохраняемую через куки. Используется для хранения общих данных пользователя Web-сайта между разными запросами. | — | [карточка](http://docs.datex.ru/article.htm?id=5665465792879477232) |


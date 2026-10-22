# Глобальные статические объекты

Источник категории: [docs.datex.ru](http://docs.datex.ru/article.htm?id=5791375928854454949).

Карточек: 12.

| Имя | Краткое описание | Связанные элементы карточки | Источник |
|---|---|---|---|
| `Application` | Глобальный объект, содержащий свойства текущего приложения. | `LocalServerBaseUrl`, `ServerBaseUrl`, `ServerUrlHost`, `ServerUrlScheme`, `WebSessions`, `GetOptWebSessionByID()` | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454911) |
| `AppLocalStorage` | AppLocalStorage позволят хранить произвольные данные приложения в рамках инсталляции на определенной машине (для десктоп версии), или на конкретном браузере (для веб-версии). Данные хранятся в виде пар "имя ключа"-"значение". | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782741) |
| `GlobalCache` | Глобальный экземпляр объекта DataCache , доступный по умолчанию.. | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782746) |
| `GlobalStorage` | Глобальный экземпляр объекта DataCache , доступный по умолчанию, с перманентным хранением данных между запусками приложения. Каждая запись храниться в отдельном url вида x-local://data/static/global_storage_entries/&lt;entry_name&gt;. Сохранение данных происходит в отдельном потоке с некотрой задержкой. Это позволяет делать вызовы GlobalStorage.SetEntry() с большой частотой, не опасаясь за производиельность.. | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782964) |
| `Math` | Описание в исходной карточке отсутствует. | — | [карточка](http://docs.datex.ru/article.htm?id=5620276905286592555) |
| `Platform` | Platform – статический глобальный объект, содержащий информацию о параметрах платформы SP-XML, на которой исполняется текущий код. | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782860) |
| `ScreenFormLib` | Встроенный глобальный объект для работы с формами. | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782885) |
| `System` | System – статический глобальный объект, содержащий информацию о параметрах операционной системы и машины, на которой работает приложение (для сервера и десктопного клиента), либо веб-браузера (для веб-клиента). | — | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454941) |
| `SystemLocaleInfo` | SystemLocaleInfo – статический глобальный объект, содержащий информацию о региональных настройках операционной системы.. | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782738) |
| `TAPI` | Встроенный глобальный объект для доступа к интерфейсу TAPI в Windows. Недоступно на других платформах. | — | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782750) |
| `UiLib` | Объект для доступа к низкоуровневым функциям UI. | `AppStartUrl`, `DefaultFontName`, `DefaultFontSizeMeasure`, `DevicePixelRatio`, `MonitorDpi`, `MonitorWorkSize`, `UseMdi`, `CalcMeasure()`, `CalcTextMinWidth()`, `ClearAllItemsCustomData()`, `GetTextLineHeight()`, `RegisterHook()` | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782887) |
| `UiText` | Содержит все зарегистрированные фразы на текущем языке интерфейса. Объект обычно формируется из файлов вида xxx_ui_text.xml, входящих в каждый модуль. | — | [карточка](http://docs.datex.ru/article.htm?id=5620276905286592588) |


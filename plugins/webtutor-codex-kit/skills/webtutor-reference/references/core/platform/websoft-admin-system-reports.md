---
status: verified
applies_to: WebSoft HCM Administrator system reports
scope: common-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-08-18
review_by: 2026-11-18
source: project-practice
---

# Системные отчёты WebSoft HCM Administrator

Материал относится к common core: `verified_on` фиксирует provenance
исследованного поставочного отчёта, но не включает version profile и не
заменяет проверку конкретного отчёта.

На примере стандартного отчёта «По вопросам тестов» подтверждена следующая
цепочка построения системного отчёта WebSoft HCM Administrator:

1. `wtv/wtv_view_main.xms` открывает основную панель
   `x-local://wtv/wtv_view_panel.xml`.
2. `wtv/wtv_view_panel.xml` загружает реестр отчётов
   `x-local://wtv/wtv_general_reports.xml`.
3. `wtv/wtv_general_reports.xml` регистрирует экран отчёта. Пользовательское
   название хранится не непосредственно в реестре, а получается через тестовую
   константу `ms_tools.get_const(...)`.
4. XML-файл экрана описывает параметры отчёта и восстановление сохранённых
   настроек.
5. Связанный XMS-файл строит интерфейс и обработчики команд. Серверная часть
   запускается через `BackgroundTask` с `RunOnServer = true` и вызывает
   зарегистрированную библиотеку посредством
   `tools.call_code_library_method(...)`.
6. Серверная библиотека выбирает и обрабатывает данные, а затем возвращает
   описание колонок, строки таблицы и ссылку на экспортированный файл.
7. Общий `ReportGrid` из `wtv/ui_reports.xms` отображает полученные колонки и
   данные.
8. Временная XMD-модель задаёт структуру промежуточных данных, а HTML-шаблон в
   `templates/` используется для формирования XLSX.

## Отчёт «По вопросам тестов»

Для исследованного отчёта роли распределены так:

| Ответственность | Файл или объект |
|---|---|
| Регистрация пункта отчёта | `wtv/wtv_general_reports.xml` |
| Форма параметров | `wtv/wtv_view_test_by_question_report.xml` |
| Интерфейс и запуск | `wtv/wtv_view_test_by_question_report.xms` |
| Серверное построение результата | `wtv/libs/test_by_questions_report_library.js` |
| Временная XML-модель | `wtv/wtv_test_question_report_table_data.xmd` |
| Общая таблица отчёта | `wtv/ui_reports.xms` |
| Шаблон экспорта | `templates/test_by_question_report.html` |

XMS запускает метод `test_by_questions_report` библиотеки с кодом
`libTestByQuestionsReport`. Библиотека формирует восемь постоянных колонок и по
четыре колонки на каждый вопрос: тип, результат, полученный ответ и правильный
ответ. Детализированная история прохождения читается с помощью
`tools.annals_decrypt`.

## Разрешение кода библиотеки в файл

Связь между кодом библиотеки из `tools.call_code_library_method` и физическим
файлом хранится в каталоге `code_librarys`. Для
`libTestByQuestionsReport` подтверждена запись:

| Поле | Значение |
|---|---|
| `code` | `libTestByQuestionsReport` |
| `name` | `Библиотека отчёта по вопросам тестов` |
| `code_url` | `x-local://wtv/libs/test_by_questions_report_library.js` |

Поэтому искать реализацию системного отчёта только по русскому названию пункта
меню ненадёжно: название может быть скрыто за тестовой константой. Надёжная
цепочка поиска — регистрация экрана, обработчик запуска, код библиотеки и его
`code_url`.

## Размещение файлов

Исследованные файлы отчёта присутствуют и в `WebSoftAdmin`, и в
`WebSoftServer`. Для пяти основных файлов отчёта их SHA-256 совпали в
установленной версии 2025.2.1403:

- `wtv_general_reports.xml`;
- `wtv_view_test_by_question_report.xml`;
- `wtv_view_test_by_question_report.xms`;
- `wtv_test_question_report_table_data.xmd`;
- `libs/test_by_questions_report_library.js`.

Это подтверждает зеркальность именно исследованных копий, но не является
общим правилом для любых файлов и версий WebTutor.

## Границы подтверждения

- Схема подтверждена по исходникам отчёта «По вопросам тестов» в версии
  2025.2.1403; не установлено, что все системные отчёты построены одинаково.
- Регистрация `libTestByQuestionsReport` и её `code_url` проверены read-only
  запросом к `code_librarys`.
- Интерактивный запуск отчёта и формирование XLSX в рамках исследования не
  проверялись.
- Физическое размещение нельзя подставлять вместо платформенного URL
  `x-local://`: разрешение ресурса остаётся обязанностью WebTutor.


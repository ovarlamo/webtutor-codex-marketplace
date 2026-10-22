# Функции для работы с объектами

Источник категории: [docs.datex.ru](http://docs.datex.ru/article.htm?id=5791375928854454955).

Карточек: 9.

| Имя | Краткое описание | Источник |
|---|---|---|
| `CallObjectMethod()` | Функция CallObjectMethod() позволяет вызвать метод абстрактного объекта по имени динамическим способом. Таким образом, вызов CallObjectMethod( object, 'Test', [arg1, arg2] ) эквивалентен выражению object.Test( arg1, arg2 ). | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454960) |
| `CallObjectMethodWithLock()` | Функция CallObjectMethodWithLock() работает аналогично функции CallObjectMethod() , но с блокировкой доступа через переданный lock. То есть, если во время работы функции, из другого потока будет вызвана другая функция с этим же lock, то выполнение в другом потоке не начнется, пока не завершится вызов в первом потоке. | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454966) |
| `GetClassObjectPropertyNames()` | Возвращает список имен всех свойств объектов класса. Возвращаетс полный список имен, описанных в деларации класса, независио от того, было ли конкретное свойтсо установлено в данном объекте. | [карточка](http://docs.datex.ru/article.htm?id=7172076235998782765) |
| `GetObjectProperty()` | Функция GetObjectProperty() позволяет получить значение | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454956) |
| `GetObjectPropertyOrSelf()` | Функция GetObjectPropertyOrSelf() эквивалентна GetObjectProperty() за одним исключением: если в качестве propName передано имя 'This', функция вернет ссылку на переданный объект. | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454957) |
| `GetObjectPropertyWithLock()` | Функция GetObjectPropertyWithLock() работает аналогично функции GetObjectProperty(), но с блокировкой доступа через переданный lock. То есть, если во время работы функции, из другого потока будет вызвана другая функция с этим же lock, то выполнение в другом потоке не начнется, пока не завершится вызов в первом потоке. | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454962) |
| `GetOptObjectProperty()` | Функция GetOptObjectProperty() эквивалентна GetObjectProperty() за одним исключением: если в объекте отсутствует данное свойство, то функция возвращает undefined. | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454958) |
| `SetObjectProperty()` | Функция SetObjectProperty() позволяет установить значение свойства абстрактного объекта по имени динамическим способом. Таким образом, вызов SetObjectProperty( object, 'xxx', value ) эквивалентен выражению object.xxx = value. Для стандартного объекта вызов SetObjectProperty( object, propName, value ) эквивалентен вызову object[propName] = value. | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454959) |
| `SetObjectPropertyWithLock()` | Функция SetObjectPropertyWithLock() работает аналогично функции SetObjectProperty(), но с блокировкой доступа через переданный lock. То есть, если во время работы функции, из другого потока будет вызвана другая функция с этим же lock, то выполнение в другом потоке не начнется, пока не завершится вызов в первом потоке. | [карточка](http://docs.datex.ru/article.htm?id=5791375928854454963) |


        let map;

        // Инициализация карты
        ymaps.ready(init);

        function init() {
            map = new ymaps.Map('map', {
                center: [55.76, 37.64], // Центр карты (Москва)
                zoom: 7
            });
        }

        // Функция для расчета времени поездки
        function calculateTrip() {
            const fromCity = document.getElementById('fromCity').value;
            const toCity = document.getElementById('toCity').value;
            const speed = parseFloat(document.getElementById('speed').value);

            if (!fromCity || !toCity || !speed || speed <= 0) {
                alert("Пожалуйста, заполните все поля корректно!");
                return;
            }

            // Поиск координат городов
            ymaps.geocode(fromCity).then(function (res) {
                const fromCoords = res.geoObjects.get(0).geometry.getCoordinates();

                ymaps.geocode(toCity).then(function (res) {
                    const toCoords = res.geoObjects.get(0).geometry.getCoordinates();

                    // Создание маршрута
                    const multiRoute = new ymaps.multiRouter.MultiRoute({
                        referencePoints: [
                            fromCoords,
                            toCoords
                        ],
                        params: {
                            routingMode: 'auto' // Режим маршрутизации (авто)
                        }
                    }, {
                        boundsAutoApply: true
                    });

                    // Очистка карты и добавление нового маршрута
                    map.geoObjects.removeAll();
                    map.geoObjects.add(multiRoute);

                    // Расчет времени поездки
                    multiRoute.model.events.add('requestsuccess', function () {
                        const distance = multiRoute.getActiveRoute().properties.get('distance').value; // Расстояние в метрах
                        const distanceKm = distance / 1000; // Переводим в километры
                        const timeHours = distanceKm / speed; // Время в часах

                        // Форматируем время
                        const hours = Math.floor(timeHours);
                        const minutes = Math.round((timeHours - hours) * 60);

                        document.getElementById('result').innerText = `Расстояние: ${distanceKm.toFixed(2)} км. Время поездки: ${hours} ч ${minutes} мин.`;
                    });
                });
            }).catch(function (error) {
                alert("Ошибка при поиске городов. Проверьте введенные данные.");
            });
        }
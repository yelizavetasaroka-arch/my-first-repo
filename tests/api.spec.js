import { test, expect } from "@playwright/test";

test.describe("API-тесты для Restful-booker", () => {
  const baseURL = "https://restful-booker.herokuapp.com";

  const bookingData = {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-01-01",
      checkout: "2024-01-05",
    },
    additionalneeds: "Breakfast",
  };

  const updatedBookingData = {
    firstname: "Alice",
    lastname: "Smith",
    totalprice: 200,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-02-01",
      checkout: "2024-02-10",
    },
    additionalneeds: "Lunch",
  };

  async function getAuthToken(request) {
    const authResponse = await request.post(`${baseURL}/auth`, {
      data: {
        username: "admin",
        password: "password123",
      },
    });
    expect(authResponse.status()).toBe(200);
    const authBody = await authResponse.json();
    return authBody.token;
  }

  async function createBooking(request) {
    const response = await request.post(`${baseURL}/booking`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: bookingData,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    return responseBody.bookingid;
  }

  test("1. Создание бронирования (Create - POST)", async ({ request }) => {
    const response = await request.post(`${baseURL}/booking`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: bookingData,
    });

    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log("Тело ответа:", responseBody);

    expect(responseBody).toHaveProperty("bookingid");
    expect(responseBody.bookingid).toBeGreaterThan(0);
    expect(responseBody.booking).toEqual(bookingData);

    console.log(`Созданное бронирование ID: ${responseBody.bookingid}`);
  });

  test("2. Получение информации о бронировании (Read - GET)", async ({
    request,
  }) => {
    // Создаем новое бронирование для этого теста
    const bookingId = await createBooking(request);

    const response = await request.get(`${baseURL}/booking/${bookingId}`, {
      headers: {
        Accept: "application/json",
      },
    });

    console.log(`Статус-код GET запроса: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(
      "Тело ответа GET запроса:",
      JSON.stringify(responseBody, null, 2)
    );

    expect(responseBody).toEqual(bookingData);
  });

  test("3. Обновление бронирования (Update - PUT)", async ({ request }) => {
    const bookingId = await createBooking(request);
    console.log(`Используем bookingId для обновления: ${bookingId}`);

    // Получаем токен авторизации
    const authToken = await getAuthToken(request);
    console.log(`Получен токен авторизации: ${authToken}`);

    const response = await request.put(`${baseURL}/booking/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `token=${authToken}`,
      },
      data: updatedBookingData,
    });

    console.log(`Статус-код PUT запроса: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(
      "Тело ответа PUT запроса:",
      JSON.stringify(responseBody, null, 2)
    );

    expect(responseBody).toEqual(updatedBookingData);
  });

  test("4. Удаление бронирования (Delete - DELETE)", async ({ request }) => {
    const bookingId = await createBooking(request);
    console.log(`Используем bookingId для удаления: ${bookingId}`);

    const authToken = await getAuthToken(request);
    console.log(`Используем токен авторизации: ${authToken}`);

    const response = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${authToken}`,
      },
    });

    console.log(`Статус-код DELETE запроса: ${response.status()}`);
    expect(response.status()).toBe(201);

    console.log("Бронирование успешно удалено");

    console.log("--- Проверяем что бронирование удалено ---");

    const getResponse = await request.get(`${baseURL}/booking/${bookingId}`, {
      headers: {
        Accept: "application/json",
      },
    });

    console.log(
      `Статус-код GET запроса после удаления: ${getResponse.status()}`
    );

    expect(getResponse.status()).toBe(404);
    console.log(" Бронирование больше не существует (404 Not Found)!");
  });
});

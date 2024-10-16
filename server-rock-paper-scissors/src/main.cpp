#include <ArduinoJson.h>

JsonDocument doc;
String jsonString;

void setup()
{
	Serial.begin(9600);
}

void loop()
{
	while (Serial.available())
	{							
		char c = Serial.read();

		jsonString += c;

		if (c == '}')
		{
			DeserializationError error = deserializeJson(doc, jsonString);
			JsonDocument response;
			String resp = "";

			if (error)
			{
				response["error"] = "Failed to parse JSON";
        response["message"] = error.c_str();
        response["json"] = jsonString;
        jsonString = "";
				serializeJson(response, resp);
				Serial.println(resp);
				return;
			}

			jsonString = "";

			response["message"] = String((const char*)doc["message"]) + " from server";

			serializeJson(response, resp);

			Serial.println(resp);
		}
	}
}
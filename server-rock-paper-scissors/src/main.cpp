#include <ArduinoJson.h> // Include the ArduinoJson library

JsonDocument doc;
String jsonString;

String randomChoice()
{
	int choice = random(3);
	if (choice == 0)
	{
		return "Rock";
	}
	else if (choice == 1)
	{
		return "Paper";
	}
	else
	{
		return "Scissors";
	}
}

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
				serializeJson(response, resp);
				Serial.println(resp);
				return;
			}

			jsonString = "";
			

			if (!doc["player1Choice"])
			{
				doc["player1Choice"] = randomChoice();
			}
			
			if (!doc["player2Choice"])
			{
				doc["player2Choice"] = randomChoice();
			}

			if (doc["player1Choice"] == doc["player2Choice"])
			{
				response["winner"] = 3;
			}
			else if (doc["player1Choice"] == "Rock" && doc["player2Choice"] == "Scissors")
			{
				response["winner"] = 1;
			}
			else if (doc["player1Choice"] == "Rock" && doc["player2Choice"] == "Paper")
			{
				response["winner"] = 2;
			}
			else if (doc["player1Choice"] == "Scissors" && doc["player2Choice"] == "Rock")
			{
				response["winner"] = 2;
			}
			else if (doc["player1Choice"] == "Scissors" && doc["player2Choice"] == "Paper")
			{
				response["winner"] = 1;
			}
			else if (doc["player1Choice"] == "Paper" && doc["player2Choice"] == "Rock")
			{
				response["winner"] = 1;
			}
			else if (doc["player1Choice"] == "Paper" && doc["player2Choice"] == "Scissors")
			{
				response["winner"] = 2;
			}

			response["player1Choice"] = doc["player1Choice"];
			response["player2Choice"] = doc["player2Choice"];

			serializeJson(response, resp);

			Serial.println(resp);
		}
	}
}
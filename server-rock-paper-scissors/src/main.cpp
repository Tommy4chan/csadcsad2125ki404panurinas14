#include <ArduinoJson.h>

JsonDocument doc;
String jsonString;
JsonDocument winConditions;

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
	winConditions["Rock"] = "Scissors";
	winConditions["Scissors"] = "Paper";
	winConditions["Paper"] = "Rock";
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

			String player1Choice = doc["player1Choice"];
			String player2Choice = doc["player2Choice"];

			if (!doc["player1Choice"])
			{
				player1Choice = randomChoice();
			}

			if (!doc["player2Choice"])
			{
				player2Choice = randomChoice();
			}

			int winner = 2;

			if (player1Choice == player2Choice)
			{
				winner = 3;
			}
			else if (winConditions[player1Choice] == player2Choice)
			{
				winner = 1;
			}

			response["winner"] = winner;
			
			response["player1Choice"] = player1Choice;
			response["player2Choice"] = player2Choice;

			serializeJson(response, resp);

			Serial.println(resp);
		}
	}
}
#include <ArduinoJson.h> // Include the ArduinoJson library

JsonDocument doc;
String jsonString;
JsonDocument gameOutcome;

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
	gameOutcome["RockScissors"] = 1;
	gameOutcome["RockPaper"] = 2;
	gameOutcome["ScissorsRock"] = 2;
	gameOutcome["ScissorsPaper"] = 1;
	gameOutcome["PaperRock"] = 1;
	gameOutcome["PaperScissors"] = 2;
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

			int winner;
			if (player1Choice == player2Choice)
			{
				winner = 3;
			}
			else
			{
				winner = gameOutcome[player1Choice + player2Choice];
			}

			response["winner"] = winner;

			response["player1Choice"] = player1Choice;
			response["player2Choice"] = player2Choice;

			serializeJson(response, resp);

			Serial.println(resp);
		}
	}
}
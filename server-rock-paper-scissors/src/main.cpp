#include <ArduinoJson.h>

JsonDocument doc;
String jsonString;
JsonDocument winConditions;

int lastUserMove = 0;

int transitionTable[3][3] = {{0, 0, 0}, {0, 0, 0}, {0, 0, 0}};

String moveToString(int choice)
{
	if (choice == 0)
		return "Rock";
	if (choice == 1)
		return "Paper";
	return "Scissors";
}

String randomChoice()
{
	return moveToString(random(3));
}

int playerChoiceToInt(String choice)
{
	if (choice == "Rock")
		return 0;
	if (choice == "Paper")
		return 1;
	return 2;
}

String predictMove()
{
	int mostLikelyNextMove = 0;

	for (int i = 1; i < 3; i++)
	{
		if (transitionTable[lastUserMove][i] > transitionTable[lastUserMove][mostLikelyNextMove])
		{
			mostLikelyNextMove = i;
		}
	}

	return moveToString((mostLikelyNextMove + 1) % 3);
}

void setup()
{
	Serial.begin(9600);
	winConditions["Rock"] = "Scissors";
	winConditions["Scissors"] = "Paper";
	winConditions["Paper"] = "Rock";

	lastUserMove = random(3);
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
				if (!doc["player1Choice"])
				{
					player2Choice = randomChoice();
				}
				else
				{
					player2Choice = predictMove();
					int currentMove = playerChoiceToInt(player1Choice);
					transitionTable[lastUserMove][currentMove]++;
					lastUserMove = currentMove;
				}
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
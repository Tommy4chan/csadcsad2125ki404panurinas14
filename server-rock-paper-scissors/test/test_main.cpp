#include <Arduino.h>
#include <unity.h>
#include <ArduinoJson.h>
#include <game.h>

void test_moveToString() {
    TEST_ASSERT_EQUAL_STRING("Rock", moveToString(0).c_str());
    TEST_ASSERT_EQUAL_STRING("Paper", moveToString(1).c_str());
    TEST_ASSERT_EQUAL_STRING("Scissors", moveToString(2).c_str());
}

void test_relu() {
    TEST_ASSERT_EQUAL_FLOAT(0.0, relu(-5.0));
    TEST_ASSERT_EQUAL_FLOAT(3.5, relu(3.5));
}

void test_softmax() {
    float testArray[3] = {1.0, 2.0, 3.0};
    softmax(testArray, 3);
    float sum = testArray[0] + testArray[1] + testArray[2];
    TEST_ASSERT_FLOAT_WITHIN(0.01, 1.0, sum);
    TEST_ASSERT_TRUE(testArray[0] < testArray[2]);
}

void test_predict() {
    String result = predict();
    TEST_ASSERT_TRUE(result == "Rock" || result == "Paper" || result == "Scissors");
    TEST_MESSAGE(result.c_str());
}

void test_addPlayerMove() {
    addPlayerMove(1);  // Add "Paper"
    TEST_ASSERT_EQUAL(1, lastMoves[0]);
    addPlayerMove(2);  // Add "Scissors"
    TEST_ASSERT_EQUAL(2, lastMoves[0]);
    TEST_ASSERT_EQUAL(1, lastMoves[1]);
}

void test_playerChoiceToInt() {
    TEST_ASSERT_EQUAL(0, playerChoiceToInt("Rock"));
    TEST_ASSERT_EQUAL(1, playerChoiceToInt("Paper"));
    TEST_ASSERT_EQUAL(2, playerChoiceToInt("Scissors"));
}

void setup() {
    UNITY_BEGIN();
    RUN_TEST(test_moveToString);
    RUN_TEST(test_relu);
    RUN_TEST(test_softmax);
    RUN_TEST(test_predict);
    RUN_TEST(test_addPlayerMove);
    RUN_TEST(test_playerChoiceToInt);
    UNITY_END();
}

void loop() {}

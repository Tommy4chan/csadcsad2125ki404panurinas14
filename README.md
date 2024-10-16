# Details about repository
This repository contains a project for a hardware-based Rock Paper Scissors game using Arduino Nano and Js. The game logic and decision-making will run primarily on the Arduino Nano, while the React application will serve as a graphical interface for users to interact with the game.
 

## Student details
| Student number | Game | config format |
| :-----------: | :-------------: | :-----------: |
| 14 | rock paper scissors | JSON |

## Technology Stack and Hardware Used

### Hardware
- **Arduino Nano**: The Arduino will handle most of the game logic, including managing inputs, processing the current game state, and sending data to the React application.

### Software
- **PlatformIO**: To write and upload the logic code to the Arduino Nano, primarily using C/C++ for low-level control.

### Programming Languages
- **C/C++**: Used in the Arduino environment to develop the Rock Paper Scissors game logic.
- **Js**: Used for client app with React

### Communication
- **Serial Communication**: The Arduino will communicate with the app through a UART serial port to send and receive game status and input data.
--- 

### To Build and Run the Client (Js/React Application):

1. Fetch feature/develop/task2 branch
2. Navigate to csad2425ki404panurinas14/client-rock-paper-scissors
3. Install dependencies by typing npm install
4. Run the application by npm run dev

### To Build and Run the Server (Arduino Sketch):

1. Open folder csad2425ki404panurinas14/server-rock-paper-scissors with PlatformIO extension
2. Plug into the computer your Arduino Nano board (board can be changed in platformio.ini file)
3. Program controller by pressing the upload button
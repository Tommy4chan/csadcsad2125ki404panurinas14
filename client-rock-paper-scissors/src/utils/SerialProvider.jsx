import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// RESOURCES:
// https://web.dev/serial/
// https://reillyeon.github.io/serial/#onconnect-attribute-0
// https://codelabs.developers.google.com/codelabs/web-serial

/**
 * @file SerialProvider.js
 * @module SerialProvider
 * 
 * Provides serial communication capabilities.
 */

/**
 * @typedef {Object} SerialContextValue
 * @property {boolean} canUseSerial Indicates if the serial API is available.
 * @property {boolean} hasTriedAutoconnect Indicates if an attempt to auto-connect has been made.
 * @property {Function} connect Function to manually connect to the serial port.
 * @property {Function} disconnect Function to manually disconnect from the serial port.
 * @property {string} portState The current state of the serial port ("closed", "opening", "open", "closing").
 * @property {Function} send Function to send data through the serial port.
 * @property {Function} subscribe Function to subscribe to serial port events.
 */

/**
 * Context for managing serial port connections.
 * 
 * @type {React.Context<SerialContextValue>}
 */
const SerialContext = createContext({
  canUseSerial: false,
  hasTriedAutoconnect: false,
  connect: () => Promise.resolve(false),
  disconnect: () => {},
  portState: "closed",
  send: () => Promise.resolve(false),
  subscribe: () => () => {}
});

/**
 * Hook to access the SerialContext.
 * @returns {SerialContextValue} The serial context values.
 */
export const useSerial = () => useContext(SerialContext);

/**
 * SerialProvider component that provides serial communication capabilities.
 * It manages the state of the serial port, handles connection and disconnection,
 * and allows subscribing to incoming data.
 *
 * @component
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components to be wrapped by the provider.
 * @returns {JSX.Element} The SerialProvider component.
 *
 * @example
 * <SerialProvider>
 *   <YourComponent />
 * </SerialProvider>
 */
const SerialProvider = ({ children }) => {
  const [canUseSerial] = useState(() => "serial" in navigator);
  const [portState, setPortState] = useState("closed");
  const [hasTriedAutoconnect, setHasTriedAutoconnect] = useState(false);
  const [hasManuallyDisconnected, setHasManuallyDisconnected] = useState(false);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const readerClosedPromiseRef = useRef(Promise.resolve());

  const currentSubscriberIdRef = useRef(0);
  const subscribersRef = useRef(new Map());

  /**
   * Subscribes to incoming data from the serial port.
   * 
   * @param {Function} callback The callback function to handle incoming data.
   * @returns {Function} Unsubscribe function to stop receiving data.
   */
  const subscribe = (callback) => {
    const id = currentSubscriberIdRef.current;
    subscribersRef.current.set(id, callback);
    currentSubscriberIdRef.current++;
    return () => {
      subscribersRef.current.delete(id);
    };
  };

  /**
   * Sends data through the serial port.
   * 
   * @async
   * @param {Object} data The data to send.
   * @returns {Promise<void>} Resolves when the data is sent.
   */
  const send = async (data) => {
    if (portRef.current && portState === "open") {
      const encoder = new TextEncoder();
      const jsonString = JSON.stringify(data);
      const writer = portRef.current.writable.getWriter();
      try {
        await writer.write(encoder.encode(jsonString));
      } catch (error) {
        console.error("Failed to send data:", error);
      } finally {
        writer.releaseLock();
      }
    } else {
      console.error("Port is not open. Unable to send data.");
    }
  };

  /**
   * Reads data from the serial port until it is closed.
   * 
   * @async
   * @param {SerialPort} port The serial port to read from.
   * @returns {Promise<void>} Resolves when the port is closed.
   */
  const readUntilClosed = async (port) => {
    if (port.readable) {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      readerRef.current = textDecoder.readable.getReader();

      let buffer = "";

      try {
        while (true) {
          const { value, done } = await readerRef.current.read();
          if (done) {
            break;
          }
          buffer += value;
          let boundaryIndex;

          while ((boundaryIndex = buffer.indexOf('\n')) !== -1) {
            const jsonString = buffer.slice(0, boundaryIndex);
            buffer = buffer.slice(boundaryIndex + 1);

            try {
              const message = jsonString;
              const timestamp = Date.now();
              Array.from(subscribersRef.current).forEach(([_, callback]) => {
                callback({ value: message, timestamp });
              });
            } catch (e) {
              console.error("Failed to parse JSON:", e);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        readerRef.current.releaseLock();
      }
      await readableStreamClosed.catch(() => {});
    }
  };

  const openPort = async (port) => {
    try {
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      setPortState("open");
      setHasManuallyDisconnected(false);
    } catch (error) {
      setPortState("closed");
      console.error("Could not open port");
    }
  };

  const manualConnectToPort = async () => {
    if (canUseSerial && portState === "closed") {
      setPortState("opening");
      try {
        const port = await navigator.serial.requestPort();
        await openPort(port);
        return true;
      } catch (error) {
        setPortState("closed");
        console.error("User did not select port");
      }
    }
    return false;
  };

  const autoConnectToPort = async () => {
    if (canUseSerial && portState === "closed") {
      setPortState("opening");
      const availablePorts = await navigator.serial.getPorts();
      if (availablePorts.length) {
        const port = availablePorts[0];
        await openPort(port);
        return true;
      } else {
        setPortState("closed");
      }
      setHasTriedAutoconnect(true);
    }
    return false;
  };

  const manualDisconnectFromPort = async () => {
    if (canUseSerial && portState === "open") {
      const port = portRef.current;
      if (port) {
        setPortState("closing");

        readerRef.current?.cancel();
        await readerClosedPromiseRef.current;
        readerRef.current = null;

        await port.close();
        portRef.current = null;

        setHasManuallyDisconnected(true);
        setHasTriedAutoconnect(false);
        setPortState("closed");
      }
    }
  };

  const onPortDisconnect = async () => {
    await readerClosedPromiseRef.current;
    readerRef.current = null;
    readerClosedPromiseRef.current = Promise.resolve();
    portRef.current = null;
    setHasTriedAutoconnect(false);
    setPortState("closed");
  };

  useEffect(() => {
    const port = portRef.current;
    if (portState === "open" && port) {
      const aborted = { current: false };
      readerRef.current?.cancel();
      readerClosedPromiseRef.current.then(() => {
        if (!aborted.current) {
          readerRef.current = null;
          readerClosedPromiseRef.current = readUntilClosed(port);
        }
      });

      navigator.serial.addEventListener("disconnect", onPortDisconnect);

      return () => {
        aborted.current = true;
        navigator.serial.removeEventListener("disconnect", onPortDisconnect);
      };
    }
  }, [portState]);

  // useEffect(() => {
  //   if (
  //     canUseSerial &&
  //     !hasManuallyDisconnected &&
  //     !hasTriedAutoconnect &&
  //     portState === "closed"
  //   ) {
  //     autoConnectToPort();
  //   }
  // }, [canUseSerial, hasManuallyDisconnected, hasTriedAutoconnect, portState]);

  return (
    <SerialContext.Provider
      value={{
        canUseSerial,
        hasTriedAutoconnect,
        subscribe,
        portState,
        connect: manualConnectToPort,
        send: send,
        disconnect: manualDisconnectFromPort
      }}
    >
      {children}
    </SerialContext.Provider>
  );
};

export default SerialProvider;

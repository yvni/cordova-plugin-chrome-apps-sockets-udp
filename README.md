# Custom devalore  fork repository

This plugin provides UDP sockets for Android , iOS and Windows (WUP).

## Status

Beta on Android iOS and Windows.

Native source code functions and object usage
~ stands for objects
- stands for functions
==============================================

android (.Java):
	~ has timer object global.
	~ has global timerTick object
	- create
	- bind
	- send
	- startInterval
	- updateIntervalData
	- stopInterval
	- close
ios (.m):
	~ has global timer pointer
	- has local tick function
	- create
	- bind
	- send
	- close
	- startInterval
	- stopInterval
	- updateIntervalData
windows (.js):
	~ has global json object for single socket info
	~ has global json object for interval socket info
	- openSocket
	- send
	- closeSocket
	- startWinInterval
	- stopWinInterval
	- updateIntervalData

## Reference

The API reference for ios and android is [here](https://developer.chrome.com/apps/sockets_udp).
The APi reference for windows is [here] (https://github.com/Microsoft/Windows-universal-samples).



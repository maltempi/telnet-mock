# Telnet Mock

A opensource NodeJS project to emulate a telnet server.
You just need set up a configuration json file with the behavior that you want.

#### Features

1. Emulate Windows or Linux environments (independent from your OS where you are running).
2. Hello Message when some telnet client connect.
3. Authentication: Configure what is acceptables users to login on telnet server.
3.1 Welcome message on authentication.
3.2 Message on invalid user.
3.3 Configurable max attempts to login on the session.
3.4 Message on max attempts.
3.5 Configurable asks for User and password.
4. CD and PDW commands. You mock CD for any folder, and the current folder on cursor will change.
	eg. 

		> c:\> cd "program files"
		> c:\program files>

5. Folder not found. You can configure folders that you don't want that exist on your environment.
	5.1 You can configure what message you want.
	
	eg.

		> c:\> cd any_folder
		> folder does not exists
		> c:\>

6. Commands Mock. You can define behaviors for each command. See more about that below. 

#### Mounting your own Telnet Mock Server

##### Requirements:

NodeJS (Tested on 4.2.2)

##### Configuring the environment

1. Clone this project
2. Run:
	> npm install

##### Creating a Config Json File

Exists an example on root folder of this project (config_sample.json).

Obs. I will think in a better way to documentate it better. :-)

> .path
$	str
$	Mandatory
$	Acceptable values: / or \\

> .os 
$	str
$	Mandatory
$	Acceptable values: windows or linux

> .helloMessage
$	Doesn't mandatory
$	obj

> .helloMessage.message
$	String
$	Mandatory

> .authentication
$	Doesn't mandatory
$	obj

> .authentication.askForUserMessage
$	Mandatory
$	String

> .authentication.askForPasswdMessage
$	Mandatory
$	String

> .authentication.onSuccessMessage
$	Mandatory
$	String

> .authentication.onInvalidUserMessage
$	Mandatory
$	String

> .authentication.onMaxAttemptMessage
$	Mandatory
$	String

> .authentication.maxAttempts
$	Mandatory
$	Integer

> .authentication.validUsers
$	Mandatory
$	List of objects

> .authentication.validUsers.login
$	Mandatory
$	String

> .authentication.validUsers.password
$	Mandatory
$	String

> .authentication.validUsers.initialFolder
$	Mandatory
$	String


> .folerNotFound
$	Mandatory
$	List Of String

> .folderNotFoundMessage
$	Mandatory
$	Object

> .folderNotFoundMessage.message
$	Mandatory
$	String

> .mockCommandsFilesFolder
$	Mandatory
$	String
$	Description: you can pass files content as return of one command, so, all of them need stay in the same place.

> .commandNotFoundMessage
$	Mandatory
$	Object

> .commandNotFoundMessagemessage
$	Mandatory
$	String

> .commandsMock
$	Mandatory
$	List of objects

> .commandsMock.command
$	Mandatory
$	String
$	Description: command that client will send to server

> .commandsMock.result
$	Mandatory
$	Object

> .commandsMock.result.type
$	Mandatory
$	string
$	Accepted values: text or resultInFile

> .commandsMock.result.response
$	Mandatory on type is text
$	string

> .commandsMock.result.filePath
$	Mandatory on type is resultInFile
$	String
$	Must be a relative path from mockCommandsFilesFolder property


##### Running

node src/index.js -c=path_to_your_config.json [-p=PORT]

Obs. Default port: 3000

##### Developing

Using mocha to develop tests, as far as possible, we need create tests for each feature.

To run tests:

	> grunt tests

##### Cool, I want collaborate!

Yeah, every help/idea is welcome! Don't hesitate to make your pull request or contact me to help to improve it.
Helps for documentations are very welcome too! :-)


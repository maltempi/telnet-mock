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

Exists an example on root folder of this project with all features (config_sample.json). Below is a list of definitions of each configuration.

- path (str, required) - Acceptable values: / or \\

- os (str, required) - Acceptable values: windows or linux

- helloMessage (obj)

- helloMessage.message (str, required)

- authentication (obj)

- authentication.askForUserMessage (str, required)

- authentication.askForPasswdMessage (str, required)

- authentication.onSuccessMessage (str, required)

- authentication.onInvalidUserMessage (str, required)

- authentication.onMaxAttemptMessage (str, required)

- authentication.maxAttempts (int, required)

- authentication.validUsers (list of object, required)

- authentication.validUsers.login (str, required)

- authentication.validUsers.password (str, required)

- authentication.validUsers.initialFolder (str, required)

- folderNotFound (list of str, required)

- folderNotFoundMessage (obj, required)

- folderNotFoundMessage.message (obj, required)

- mockCommandsFilesFolder (requied, string)
	- Description: You can pass files content as return of one command, so, all of them need stay in the same place.

- commandNotFoundMessage (obj, required)

- commandNotFoundMessagemessage (str, required)

- commandsMock (list of obj, required)

- commandsMock.command (str, required) - command that client will send to server. Also is possible pass a regex.
	-  Obs. If you want use a scape to back-slash (\\), you can pass a variable {bslash}, eg:
	   "command": 'find test c:{bslash}folder{bslash}\\d+.csv'
			will be translate to:
	 "command": 'find test c:\\\\folder\\\\\\d+.csv'

- comandsMock.regex (bool) - Indicate that command uses regex. Mandatory when command is using regex.

- commandsMock.result (obj, required)

- commandsMock.result.type (str, required) Accepted values: text or resultInFile

- commandsMock.result.response (str, required) - Response to command. Require only when type is text

- commandsMock.result.filePath (str, required) - Filepath to response wanted. Require only when type is resultInFile.
	- Must be a relative path from mockCommandsFilesFolder property


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


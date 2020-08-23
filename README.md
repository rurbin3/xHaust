### xHaust

#### 💪⚡ Blazingly fast HTTP brute forcer made in Node.js, xHausting your logins... For science.

![alt text](logo.png 'xHaust')

#### Installation

```bash
npm install -g xhaust
```

#### Usage

```bash
Usage: xhaust [options]

Options:
  -V, --version                        output the version number
  -a, --attackUri <attackUri>          protocol URI to attack
  -u, --user <user>                    username to use in attack payload
  -U, --userfile <userfile>            file full of usernames to use in attack payload
  -p, --pass <pass>                    password to use in attack payload
  -P, --passfile <passfile>            file full of passwords to use in attack payload
  -l, --limitParallel <limitParallel>  max parallel requests at a time
  -b, --batchSize <batchSize>          the get and post requests batch size
  -d, --dry-run <dryRun>               executes the attack in dry run mode
  -T, --test                           run attack on in built local http server for testing
  -t, --tags <tags>                    tags to use for this attack seperated by hypens (Ex. http-post-urlencoded)
  -i, --input <input>                  input string to use as first scan structure data (Ex. form input names configurations)
  -o, --output <output>                output string to use as payload for attack, will replace :username: :password: and :csrf: with respectable values
  -g, --useGui                         enable gui
  -h, --help                           display help for command

Example call:
  $ xhaust -a https://website.com -t -a http://somewebsite.com http-post-urlencoded -u admin -P passwords.txt -s 1000 -l 130 -i "csrf=token" -o "username=:username:&password=:password:&csrftoken=:csrf:"
```

![alt text](https://i.imgur.com/XIazZdn.png)

#### Project Layout

    .
    ├── ...
    ├── xhaust.js               # Main class file of xHaust, handles most control flow
    ├── entry.js                # Entry file for unit tests, cli or otherwise
    ├── attacks                 # Houses attack middleware files, these are the
    ├── classes                 # Any class files that are not instanced automatically by xHaust
    ├── logs                    # Log files created by xHaust
    ├── metadata                # Metadata folder stores arbitrary data for example attack files
    ├── modules                 # A simple module object that performs basic tasks
    ├── packages                # Packages are classes that are imported and instanced by xHaust and are the internal workings
    ├── test                    # Test folder that holds all test scripts
    └── ...

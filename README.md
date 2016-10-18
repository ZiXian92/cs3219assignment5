# CS3219 Assignment 5 GitGuard (or whatever better name)
Can't think of a good description here.

## Development System Requirements
- NodeJS with `mocha`, `typescript` and `typings` installed globally OR  
- Docker and Docker-Compose

## Directory Structure
```
root
|_ datalogic // All data manipulation/computation logic components here
|_ tests // All unit tests here
```

## Docker Setup
1. Clone the repository.
2. Change directory to project root and run `docker-compose up -d --build`.
3. Enter the container with `docker-compose exec app bash` to run any Typescript compilation or Mocha tests(`npm test`).

## Testing Single Unit Test File
1. In the NodeJS environment(local or Docker), run `tsc`, followed by `mocha compiled/tests/<compiled_test_file_path>`.

## Continuous Integration
CI is done using free account on Shippable. CI tests are triggered only during pull requests. Log in to Shippable and select this project to view build results on console.  

** *Note:** CI setup for pull requests is still a WIP as it is still unknown what happens if there are multiple pending pull requests to the same branch and one of them is merged.

## FAQs
1. **Typescript compiler doesn't recognize a NodeJS module.**  
Probably it requires Typescript definition type for that module. Search for the module with `typings search <module_name>`. Then install using `typings install --save --global <module_name>`. Example for Mocha is `typings install --save --global dt~mocha`. Then in the affected code, add `/// <reference path="<relative path to .d.ts file>" />` at the top.

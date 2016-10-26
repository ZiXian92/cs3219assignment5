# CS3219 Assignment 5 GitGuard (or whatever better name)
Can't think of a good description here.

## Development System Requirements
- NodeJS with `mocha`, `typescript` and `typings` installed globally OR  
- Docker and Docker-Compose
- `rimraf` package installed globally

## Directory Structure
```
root
|_ datalogic // All data manipulation/computation logic components here
|_ tests // All unit tests here
|_ server // Server-side code here
|_ src  // Angular2 and other front-end code here
|_ config // Webpack configuration files here
```

## Local Setup
1. Clone the repository.
2. Change directory to project root.
3. Run `npm install`.
4> Run `typings install`.

## Docker Setup
1. Clone the repository.
2. Change directory to project root and run `docker-compose up -d --build`.
3. Enter the container with `docker-compose exec app bash` to run any Typescript compilation or Mocha tests(`npm test`).
4. Run `npm install`.
5. Run `typings install`.

## Workflow
1. Work on a branch that is not `master` or `develop` to avoid polluting them with conflicts or broken code.
2. Keep your branch up-to-date by running `git fetch origin`, `git rebase origin/develop`.
3. After pulling from upstream, run `npm install && typings install` in your chosen setup.
4. Create pull request to `develop` when done. Merge only happens after passing CI.

## Testing Single Unit Test File
1. In the NodeJS environment(local or Docker), run `tsc`, followed by `mocha compiled/tests/<compiled_test_file_path>`.

## Continuous Integration
CI is done using free account on Shippable. CI tests are triggered only during pull requests. Log in to Shippable and select this project to view build results on console.  

** *Note:** CI setup for pull requests is still a WIP as it is still unknown what happens if there are multiple pending pull requests to the same branch and one of them is merged.

## FAQs
1. **Typescript compiler doesn't recognize a NodeJS module.**  
Probably it requires type definition for that module. Google around for module `@types/<module_name>`. If it exists, run `npm install --save-dev @types/<module_name>`. Otherwise, Google around(not sure of any standard way to resolve this).

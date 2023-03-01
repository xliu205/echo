import * as main from './main'

const startHTML = `
  <div class="repl">
      <!-- To hold the command history -->
      <div class="repl-history">
        <table>
          <thead></thead>
          <tbody id="repl-results" data-testid="results" />
        </table>
      </div>
      <hr />
      <!-- To hold the command input box -->
      <div class="repl-input">
        <input
          type="text"
          class="repl-command-box"
          placeholder="Type in command here. Press ENTER to run the command."
          data-testid="command"
        />
      </div>
    </div>
    <!-- Load the script! Note: the .js extension is because browsers don't use TypeScript
    directly. Instead, the author of the site needs to compile the TypeScript to JavaScript. -->
    <script type="module" src="../src/main.js"></script>
`

beforeEach(function () {
  document.body.innerHTML = startHTML
  main.clearHistory()
  main.initializeGlobalVariables()
  main.prepareKeypress()
})

/**
 * Testing instructions:
 * User story 1: load_file command
  * 1.1. loaded CSV not in mocked.js
  * 1.2. loaded CSV with no file path
 * 
 */

// loaded CSV not in mocked.js
test('loaded CSV not in mocked.js', () => {
  main.runLoadFileCommand(['load_file', 'Denden'], 'outputPrompt')
  expect(main.runLoadFileCommand(['load_file', 'Denden'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] File path is invalid.</td></tr>"
   ])
})

// loaded CSV with no file path
test('loaded CSV with no file path', () => {
  main.runLoadFileCommand(['load_file'], 'outputPrompt')
  expect(main.runLoadFileCommand(['load_file'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] File path not provided.</td></tr>",
  ])
})


/**
 * User story 2: view command
  * 2.1. view selected CSV file
 */

//view selcted CSV file 
test('view selected CSV file', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runViewCommand('outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPromptcats displayed.</td></tr>",
    "<tr class='userData'><td>Name</td><td>Age</td><td>Color</td><td>Breed</td><td>Personality</td></tr>",
    "<tr class='userData'><td>Fluffy</td><td>2</td><td>White</td><td>Persian</td><td>Playful and curious</td></tr>",
    "<tr class='userData'><td>Mittens</td><td>4</td><td>Black and White</td><td>Domestic Shorthair</td><td>Calm and affectionate</td></tr>",
    "<tr class='userData'><td>Socks</td><td>1</td><td>Tabby</td><td>Maine Coon</td><td>Energetic and adventurous</td></tr>",
    "<tr class='userData'><td>Whiskers</td><td>3</td><td>Calico</td><td>Ragdoll</td><td>Gentle and loving</td></tr>",
    "<tr class='userData'><td>Tiger</td><td>5</td><td>Orange Tabby</td><td>Bengal</td><td>Confident and independent</td></tr>"
  ])
})

/**
 * User story 3: search command
  * 3.1. search on an unloaded file
  * 3.2. search non-existent column
  * 3.3. search CSV with numbers
  * 3.4. search column with index
  * 3.5. search CSV with no inputs
  * 3.6. search CSV with too many inputs
  * 3.7. search column index out of range
  * 3.8. search CSV with mutiple outputs
  * 3.9. search CSV with no outputs
  * 3.10. search CSV with no column
  * 
 */

// search on an unloaded file
test('search on an unloaded file', () => {
  expect(
    main.runSearchCommand(['search', 'Name', 'Tiger'], 'outputPrompt')
  ).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] No csv is selected.</td></tr>",
  ])
})

// search non-existent column
test('search non-existent column', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runSearchCommand(['search', 'Name', 'boot'], 'outputPrompt')).toStrictEqual(
    ["<tr class='message'><td>outputPromptResults not found.</td></tr>"]
  )
})

// search CSV with numbers
test('search CSV with numbers', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runSearchCommand(['search', 'Age', '2'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt1 row found in cats.</td></tr>",
    "<tr class='userData'><td>Fluffy</td><td>2</td><td>White</td><td>Persian</td><td>Playful and curious</td></tr>",
  ])
})

// search column with index
test('search column index', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runSearchCommand(['search', '0', 'Tiger'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt1 row found in cats.</td></tr>",
    "<tr class='userData'><td>Tiger</td><td>5</td><td>Orange Tabby</td><td>Bengal</td><td>Confident and independent</td></tr>"
  ])
})

// search CSV with no inputs
test('search CSV with no arguments', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runSearchCommand(['search'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] No search term provided.</td></tr>",
  ])
})

// search CSV with too many inputs
test('search CSV with too many inputs', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runSearchCommand(['search', 'i', 'o', 'p'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] Too many search terms provided.</td></tr>"
  ])
})

// search column index out of range
test('search column index out of range', () => {
  main.runLoadFileCommand(['load_file', 'cats'], 'outputPrompt')
  expect(main.runSearchCommand(['search', '10', 'Tiger'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] Column index out of bounds.</td></tr>",
  ])
})

// search CSV with mutiple outputs
test('search CSV with mutiple outputs', () => {
  main.runLoadFileCommand(['load_file', 'students'], 'outputPrompt')
  expect(main.runSearchCommand(['search', 'GPA', '3.8'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt2 rows found in students.</td></tr>",
    "<tr class='userData'><td>Emily Brown</td><td>20</td><td>Female</td><td>Psychology</td><td>3.8</td></tr>",
    "<tr class='userData'><td>Sophia Lee</td><td>20</td><td>Female</td><td>Mathematics</td><td>3.8</td></tr>",
  ])
})

// search CSV with no outputs
test('search CSV with no outputs', () => {
  main.runLoadFileCommand(['load_file', 'students'], 'outputPrompt')
  expect(main.runSearchCommand(['search', 'GPA', '0.8'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPromptResults not found.</td></tr>",
  ])
})

// search CSV with no column
test('search CSV with no column', () => {
  main.runLoadFileCommand(['load_file', 'students'], 'outputPrompt')
  expect(main.runSearchCommand(['search', '3.6'], 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt1 row found in students.</td></tr>",
    "<tr class='userData'><td>Grace Lee</td><td>21</td><td>Female</td><td>Chemistry</td><td>3.6</td></tr>"
  ])
})

/**
 * User story 4: query command
  * 4.1. non-existed query command
 */

//non-existed query command
test('non-existed query command', () => {
  main.runLoadFileCommand(['load_file', 'students'], 'outputPrompt')
  main.runSearchCommand(['search', 'GPA', '3.8'], 'outputPrompt')
  expect(main.runQueryCommand('AND', 'outputPrompt')).toStrictEqual([
    "<tr class='message'><td>outputPrompt[Error] This query command is not supported in mocking.</td></tr>",
    "<tr class='message'><td>Try the following commands instead</td></tr>",
    "<tr class='message'><td>load_file burgers</td></tr>",
    "<tr class='message'><td>query AND</td></tr>",
  ])
})

/**
 * helper functions test
 * setPathToCsv
 * getOutputMessage
 * clearHistory
 * evaluateCommand
 */

// set file Path To CSV
test('setPathToCsv', () => {
  main.setPathToCsv(`cats`)
  expect(main.getOutputMessage(``, `cats is loaded.`)).toStrictEqual([
    "<tr class='message'><td>cats is loaded.</td></tr>",
  ])
})

// get output message
test('getOutputMessage', () => {
  expect(main.getOutputMessage('prompt', 'content')).toStrictEqual([
    "<tr class='message'><td>promptcontent</td></tr>",
  ])
})

//test clear history
test('test clear history', () => {
  main.clearHistory()  
  expect(main.currentCsvName).toBe('')
  expect(main.currentCsvArray).toStrictEqual([])
  expect(main.isCsvSelected).toBe(false)
  expect(main.isVerboseMode).toBe(false)

})

//non-existed commmand
test('non-existed commmand', () => {
  main.evaluateCommand('make')
  expect(main.evaluateCommand('make')).toStrictEqual([
    "<tr class='message'><td>[Error] Command is invalid.</td></tr>",
  ])
})




# Examples

Here are some example use cases to help you get started with Modulator:

## Creating a New Block

1. Initialize a new block:
   ```javascript
   const block = modulator.createBlock('text');
   block.setContent('Hello, World!');
   editor.addBlock(block);
   ```

## Customizing Editor Settings

Modify the editor settings to change the theme and enable autosave:

```javascript
modulator.configure({
  theme: 'dark',
  autosave: true,
});
```

## Integrating Modulator into a Web Application

1. Import Modulator into your application:
   ```javascript
   import modulator from 'modulator';
   ```
2. Initialize the editor:
   ```javascript
   const editor = modulator.init('#editor-container');
   ```
3. Add blocks and customize as needed.

These examples demonstrate basic usage scenarios. For more advanced use cases, refer to the API documentation.

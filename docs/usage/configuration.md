# Configuration

Modulator offers various configuration options to tailor the editor to your needs. Configuration can be done through a JSON or YAML configuration file.

## Configuration File

Create a `modulator.config.json` or `modulator.config.yaml` file in the root of your project.

### Example JSON Configuration

```json
{
  "theme": "dark",
  "autosave": true,
  "language": "en"
}
```

### Example YAML Configuration

```yaml
theme: dark
autosave: true
language: en
```

## Environment Variables

You can also configure Modulator using environment variables:

- `MODULATOR_THEME`: Set the editor theme (`light` or `dark`).
- `MODULATOR_AUTOSAVE`: Enable or disable autosave (`true` or `false`).

Ensure the configuration file is correctly formatted to avoid errors.

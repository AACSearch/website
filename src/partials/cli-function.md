You can create functions using the CLI without needing to access the Console.

{% partial file="cli-disclaimer.md" /%}

To deploy your function with the AACSearch CLI, use the `aacsearch init functions` command to create a starter function and paste your code into the generated file and folder.

```sh
aacsearch init functions
```

To deploy the generated code, add any dependencies and push the function using the following command:

```sh
aacsearch push functions
```

{% arrow_link href="/docs/tooling/command-line/functions#commands" %}
Learn more about the CLI functions commands
{% /arrow_link %}

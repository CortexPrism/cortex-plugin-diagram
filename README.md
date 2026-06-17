# Cortex Plugin: Diagram & Whiteboard

Generate flowcharts, sequence diagrams, architecture diagrams, and mind maps from natural language.
Built-in Mermaid template library.

## Installation

```bash
cortex plugin install github:CortexPrism/cortex-plugin-diagram
```

## Tools

### diagram_generate

Generate a diagram from a natural language description.

- `description` (string, required) — What the diagram should depict
- `diagram_type` (enum, required) — Type: flowchart, sequence, class, er, mindmap, gantt,
  architecture, pie
- `output_format` (enum, default: "mermaid") — Output: mermaid, png, svg, excalidraw
- `title` (string, optional) — Diagram title

### diagram_from_code

Generate a diagram from source code structure.

- `code` (string, required) — Source code to analyze
- `diagram_type` (enum, required) — Type: class, sequence, architecture
- `language` (string, required) — Programming language

### diagram_edit

Edit an existing diagram using natural language.

- `diagram_source` (string, required) — Mermaid or Excalidraw source
- `edits` (string, required) — Natural language description of changes

### diagram_export

Export a diagram to a different format.

- `diagram_source` (string, required) — Diagram source code
- `format` (enum, required) — Output format: png, svg, pdf, mermaid, excalidraw

### diagram_list_types

List all supported diagram types with descriptions.

## Supported Diagram Types

| Type         | Description                             |
| ------------ | --------------------------------------- |
| flowchart    | Visualize processes and decision trees  |
| sequence     | Show component interactions over time   |
| class        | Model object-oriented class hierarchies |
| er           | Design entity-relationship schemas      |
| mindmap      | Organize ideas in a radial hierarchy    |
| gantt        | Plan project timelines and dependencies |
| architecture | Map system components and connections   |
| pie          | Display proportional data distributions |

## Configuration

| Key             | Type   | Description                                 |
| --------------- | ------ | ------------------------------------------- |
| `defaultType`   | select | Default diagram type                        |
| `defaultFormat` | select | Default output format: mermaid, png, svg    |
| `theme`         | select | Color theme: default, forest, dark, neutral |

## Development

```bash
deno task test
deno fmt
deno lint
```

## License

MIT

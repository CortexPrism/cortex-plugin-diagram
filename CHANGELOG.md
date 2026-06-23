# Changelog


## [1.0.3] — 2026-06-22

### Changed

- Migrated to CortexPrism v0.51.0 plugin API
- Renamed `ToolResult` → `ToolCallResult` to match SDK types
- Switched type imports from local `types.ts` to `cortex/plugins` module
- Updated `peerDependencies.cortex` to `>=0.51.0`
- Standardized UI settings: `default` → `defaultValue`, `enum` → `options` for select fields
- All code passes `deno fmt` and `deno lint`
## [Unreleased]

### Added

- Structured logging via ctx.logger in lifecycle hooks

### Changed

- Renamed manifest file from `cortex.json` to `manifest.json` for consistency with Cortex standard
- Standardized UI section structure to `ui.settings` format
- Normalized parameter naming: `defaultValue` → `default`, `options` → `enum`
- Added `homepage` field with repository URL
- Added `dependencies` field to manifest

## [1.0.1] — 2026-06-15

### Added

- Initial release

## [1.0.1] — 2026-06-17

### Added

- Initial project setup

## [1.0.0] — 2026-06-15

### Added

- Initial release of cortex-plugin-diagram
- `diagram_generate` — Generate diagrams from natural language descriptions
- `diagram_from_code` — Generate diagrams by analyzing source code
- `diagram_edit` — Edit existing diagrams with natural language
- `diagram_export` — Export diagrams to PNG, SVG, PDF, Mermaid, or Excalidraw
- `diagram_list_types` — List all 8 supported diagram types with descriptions
- Built-in Mermaid templates for flowchart, sequence, class, ER, mindmap, Gantt, architecture, and
  pie charts
- UI settings for default diagram type, format, and color theme

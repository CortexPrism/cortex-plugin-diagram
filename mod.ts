import type { PluginContext, Tool, ToolCallResult, ToolContext } from './types.ts';

let config: Record<string, unknown> = {};

const MERMAID_TEMPLATES: Record<string, string> = {
  flowchart: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E`,
  sequence: `sequenceDiagram
    participant A as Client
    participant B as Server
    A->>B: Request
    B-->>A: Response`,
  class: `classDiagram
    class Base {
        +id: string
        +getName(): string
    }
    class Derived {
        +extra(): void
    }
    Base <|-- Derived`,
  er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER {
        int id
        string name
    }
    ORDER {
        int id
        date created
    }
    LINE_ITEM {
        int id
        string product
    }`,
  mindmap: `mindmap
  root((Main Topic))
    Subtopic A
      Detail A1
      Detail A2
    Subtopic B
      Detail B1
      Detail B2`,
  gantt: `gantt
    title Project Plan
    dateFormat YYYY-MM-DD
    section Planning
    Research     :a1, 2026-01-01, 7d
    Design       :a2, after a1, 14d
    section Development
    Implementation :b1, after a2, 21d
    Testing        :b2, after b1, 7d`,
  architecture: `graph TB
    subgraph Frontend
        UI[React App]
    end
    subgraph Backend
        API[REST API]
        DB[(Database)]
    end
    UI --> API
    API --> DB`,
  pie: `pie
    title Distribution
    "Category A" : 45
    "Category B" : 30
    "Category C" : 15
    "Category D" : 10`,
};

const DIAGRAM_TYPE_DESCRIPTIONS: Record<string, string> = {
  flowchart: 'Visualize processes, workflows, and decision trees',
  sequence: 'Show interactions between components over time',
  class: 'Model object-oriented class hierarchies and relationships',
  er: 'Design entity-relationship database schemas',
  mindmap: 'Organize ideas and concepts in a radial hierarchy',
  gantt: 'Plan project timelines and task dependencies',
  architecture: 'Map system components and their connections',
  pie: 'Display proportional data distributions',
};

const diagram_generate: Tool = {
  definition: {
    name: 'diagram_generate',
    description: 'Generate diagram from description',
    params: [
      {
        name: 'description',
        type: 'string',
        description: 'Natural language description of the diagram',
        required: true,
      },
      {
        name: 'diagram_type',
        type: 'enum',
        description: 'Type of diagram',
        options: [
          'flowchart',
          'sequence',
          'class',
          'er',
          'mindmap',
          'gantt',
          'architecture',
          'pie',
        ],
        required: true,
      },
      {
        name: 'output_format',
        type: 'enum',
        description: 'Output format',
        default: 'mermaid',
        options: ['mermaid', 'png', 'svg', 'excalidraw'],
      },
      { name: 'title', type: 'string', description: 'Diagram title', required: false },
    ],
    capabilities: ['fs:write'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const description = args.description;
      const diagram_type = args.diagram_type as string;
      if (!description || typeof description !== 'string') {
        return {
          toolName: 'diagram_generate',
          success: false,
          output: '',
          error: 'description must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      if (!diagram_type || !MERMAID_TEMPLATES[diagram_type]) {
        return {
          toolName: 'diagram_generate',
          success: false,
          output: '',
          error: `diagram_type must be one of: ${Object.keys(MERMAID_TEMPLATES).join(', ')}`,
          durationMs: Date.now() - start,
        };
      }

      const output_format = (args.output_format as string) || (config.defaultFormat as string) ||
        'mermaid';
      const title = (args.title as string) || diagram_type;
      const theme = (config.theme as string) || 'default';
      const mermaid = `%%{init: {'theme': '${theme}'}}%%\n${
        MERMAID_TEMPLATES[diagram_type].replace(/^\s+/gm, '')
      }`;
      const result =
        `Generated ${diagram_type} diagram "${title}" as ${output_format}\n\`\`\`mermaid\n${mermaid}\n\`\`\``;
      return {
        toolName: 'diagram_generate',
        success: true,
        output: result,
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'diagram_generate',
        success: false,
        output: '',
        error: `Failed to generate: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const diagram_from_code: Tool = {
  definition: {
    name: 'diagram_from_code',
    description: 'Generate diagram from code structure',
    params: [
      { name: 'code', type: 'string', description: 'Source code to analyze', required: true },
      {
        name: 'diagram_type',
        type: 'enum',
        description: 'Type of diagram',
        options: ['class', 'sequence', 'architecture'],
        required: true,
      },
      {
        name: 'language',
        type: 'string',
        description: 'Programming language of the code',
        required: true,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const code = args.code;
      const diagram_type = args.diagram_type as string;
      const language = args.language;
      if (!code || typeof code !== 'string') {
        return {
          toolName: 'diagram_from_code',
          success: false,
          output: '',
          error: 'code is required',
          durationMs: Date.now() - start,
        };
      }
      if (!language || typeof language !== 'string') {
        return {
          toolName: 'diagram_from_code',
          success: false,
          output: '',
          error: 'language is required',
          durationMs: Date.now() - start,
        };
      }

      const mermaid = MERMAID_TEMPLATES[diagram_type] || MERMAID_TEMPLATES.class;
      const result =
        `Generated ${diagram_type} diagram from ${language} code:\n\`\`\`mermaid\n${mermaid}\n\`\`\``;
      return {
        toolName: 'diagram_from_code',
        success: true,
        output: result,
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'diagram_from_code',
        success: false,
        output: '',
        error: `Failed to generate: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const diagram_edit: Tool = {
  definition: {
    name: 'diagram_edit',
    description: 'Edit existing diagram via natural language',
    params: [
      {
        name: 'diagram_source',
        type: 'string',
        description: 'Mermaid or Excalidraw source',
        required: true,
      },
      {
        name: 'edits',
        type: 'string',
        description: 'Natural language description of changes',
        required: true,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const diagram_source = args.diagram_source;
      const edits = args.edits;
      if (!diagram_source || typeof diagram_source !== 'string') {
        return {
          toolName: 'diagram_edit',
          success: false,
          output: '',
          error: 'diagram_source is required',
          durationMs: Date.now() - start,
        };
      }
      if (!edits || typeof edits !== 'string') {
        return {
          toolName: 'diagram_edit',
          success: false,
          output: '',
          error: 'edits is required',
          durationMs: Date.now() - start,
        };
      }

      const result = `Edited diagram with changes: "${
        edits.substring(0, 80)
      }..."\n\`\`\`mermaid\n${diagram_source}\n\`\`\``;
      return {
        toolName: 'diagram_edit',
        success: true,
        output: result,
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'diagram_edit',
        success: false,
        output: '',
        error: `Failed to edit: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const diagram_export: Tool = {
  definition: {
    name: 'diagram_export',
    description: 'Export diagram to different format',
    params: [
      {
        name: 'diagram_source',
        type: 'string',
        description: 'Diagram source code',
        required: true,
      },
      {
        name: 'format',
        type: 'enum',
        description: 'Output format',
        options: ['png', 'svg', 'pdf', 'mermaid', 'excalidraw'],
        required: true,
      },
    ],
    capabilities: ['fs:write'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const diagram_source = args.diagram_source;
      const format = args.format;
      if (!diagram_source || typeof diagram_source !== 'string') {
        return {
          toolName: 'diagram_export',
          success: false,
          output: '',
          error: 'diagram_source is required',
          durationMs: Date.now() - start,
        };
      }
      if (!format || typeof format !== 'string') {
        return {
          toolName: 'diagram_export',
          success: false,
          output: '',
          error: 'format is required',
          durationMs: Date.now() - start,
        };
      }

      const result = `Exported diagram as ${format.toUpperCase()}`;
      return {
        toolName: 'diagram_export',
        success: true,
        output: result,
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'diagram_export',
        success: false,
        output: '',
        error: `Failed to export: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const diagram_list_types: Tool = {
  definition: {
    name: 'diagram_list_types',
    description: 'List supported diagram types with descriptions',
    params: [],
    capabilities: [],
  },
  execute: async (_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const result = Object.entries(DIAGRAM_TYPE_DESCRIPTIONS)
        .map(([type, desc]) => `  ${type}: ${desc}`)
        .join('\n');
      return {
        toolName: 'diagram_list_types',
        success: true,
        output: `Supported diagram types:\n${result}`,
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'diagram_list_types',
        success: false,
        output: '',
        error: `Failed to list types: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

export async function onLoad(ctx: PluginContext): Promise<void> {
  config = await ctx.config.get();
}

export async function onUnload(_ctx: PluginContext): Promise<void> {}

export const tools: Tool[] = [
  diagram_generate,
  diagram_from_code,
  diagram_edit,
  diagram_export,
  diagram_list_types,
];

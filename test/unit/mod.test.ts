import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { tools } from '../../mod.ts';
import type { PluginContext, ToolContext } from '../../types.ts';

// Mock PluginContext
const mockContext: PluginContext & ToolContext = {
  pluginId: 'cortex-plugin-diagram',
  pluginDir: '/tmp/plugins/cortex-plugin-diagram',
  state: {
    get: async () => null,
    set: async () => {},
    delete: async () => {},
    list: async () => ({}),
  },
  config: {
    get: async () => null,
    set: async () => {},
    getAll: async () => ({}),
  },
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  },
  host: {
    registerTool: () => {},
    unregisterTool: () => {},
  },
  sessionId: 'test-session',
  workingDir: '/tmp',
  agentId: 'test-agent',
  workspaceDir: '/tmp',
};

function findTool(name: string) {
  const tool = tools.find((t) => t.definition.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

Deno.test('tools array — exports all tools', () => {
  assertEquals(tools.length, 5);
  assertEquals(tools[0].definition.name, 'diagram_generate');
  assertEquals(tools[1].definition.name, 'diagram_from_code');
  assertEquals(tools[2].definition.name, 'diagram_edit');
  assertEquals(tools[3].definition.name, 'diagram_export');
  assertEquals(tools[4].definition.name, 'diagram_list_types');
});

Deno.test('diagram_generate — rejects empty description', async () => {
  const tool = findTool('diagram_generate');
  const result = await tool.execute({ 'description': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('diagram_from_code — rejects empty code', async () => {
  const tool = findTool('diagram_from_code');
  const result = await tool.execute({ 'code': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('diagram_edit — rejects empty diagram_source', async () => {
  const tool = findTool('diagram_edit');
  const result = await tool.execute({ 'diagram_source': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('diagram_export — rejects empty diagram_source', async () => {
  const tool = findTool('diagram_export');
  const result = await tool.execute({ 'diagram_source': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('diagram_list_types — tool is defined with name and description', () => {
  const tool = findTool('diagram_list_types');
  assertEquals(typeof tool.definition.description, 'string');
  assertEquals(tool.definition.description.length > 0, true);
});

Deno.test('all tools return durationMs', async () => {
  for (const tool of tools) {
    const args: Record<string, unknown> = {};
    const result = await tool.execute(args, mockContext);
    assertEquals(typeof result.durationMs, 'number');
    assertEquals(result.durationMs >= 0, true);
  }
});

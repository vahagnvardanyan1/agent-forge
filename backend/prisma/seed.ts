import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agentforge.dev' },
    update: {},
    create: {
      email: 'admin@agentforge.dev',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create sample agents
  const openaiAgent = await prisma.agent.upsert({
    where: { slug: 'general-assistant' },
    update: {},
    create: {
      name: 'General Assistant',
      slug: 'general-assistant',
      description: 'A general-purpose AI assistant powered by GPT-4o.',
      systemPrompt:
        'You are a helpful, accurate, and friendly AI assistant. Answer questions clearly and concisely.',
      provider: 'OPENAI',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096,
      status: 'ACTIVE',
      isPublished: true,
      category: 'general',
      tags: ['assistant', 'general', 'gpt-4o'],
      authorId: admin.id,
    },
  });
  console.log(`Created agent: ${openaiAgent.name}`);

  const anthropicAgent = await prisma.agent.upsert({
    where: { slug: 'code-reviewer' },
    update: {},
    create: {
      name: 'Code Reviewer',
      slug: 'code-reviewer',
      description:
        'An AI code review assistant powered by Claude that provides detailed feedback on code quality.',
      systemPrompt:
        'You are an expert code reviewer. Analyze code for bugs, security issues, performance problems, and style. Provide actionable suggestions.',
      provider: 'ANTHROPIC',
      model: 'claude-sonnet-4-20250514',
      temperature: 0.3,
      maxTokens: 8192,
      status: 'ACTIVE',
      isPublished: true,
      category: 'development',
      tags: ['code-review', 'development', 'claude'],
      authorId: admin.id,
    },
  });
  console.log(`Created agent: ${anthropicAgent.name}`);

  // 3. Create knowledge base
  const knowledgeBase = await prisma.knowledgeBase.create({
    data: {
      name: 'Sample Documentation',
      description: 'A sample knowledge base with project documentation.',
      pineconeIndexHost: 'https://sample-index-abc123.svc.pinecone.io',
      pineconeNamespace: 'sample-docs',
      embeddingModel: 'text-embedding-3-small',
      documentCount: 0,
      chunkCount: 0,
      ownerId: admin.id,
    },
  });
  console.log(`Created knowledge base: ${knowledgeBase.name}`);

  // 4. Create workflow template
  const workflow = await prisma.workflow.create({
    data: {
      name: 'Code Review Pipeline',
      description:
        'A workflow template that reviews code, suggests improvements, and generates documentation.',
      isTemplate: true,
      flowConfig: {
        nodes: [
          { id: 'input', type: 'input', data: { label: 'Code Input' } },
          {
            id: 'review',
            type: 'agent',
            data: { agentSlug: 'code-reviewer', label: 'Code Review' },
          },
          { id: 'output', type: 'output', data: { label: 'Review Output' } },
        ],
        edges: [
          { source: 'input', target: 'review' },
          { source: 'review', target: 'output' },
        ],
      },
    },
  });
  console.log(`Created workflow template: ${workflow.name}`);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();

  console.log('Seeding database with Figma demo tasks...');

  const task1 = await prisma.task.create({
    data: {
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: '12 Sep 2026',
      labels: JSON.stringify(['Research', 'Design', 'Development', 'Testing', 'Deployment']),
      members: JSON.stringify(['Ankit Dutta', 'Abhishek Yadav']),
      reporter: 'Ankit Dutta',
      subtasks: {
        create: [
          { title: 'Subtask 1', priority: 'HIGH', dueDate: '12 Sep 2026', completed: false },
          { title: 'Subtask 2', priority: 'LOW', dueDate: '15 Sep 2026', completed: true },
          { title: 'Subtask 3', priority: 'MEDIUM', dueDate: '18 Sep 2026', completed: false },
        ],
      },
      activities: {
        create: [
          { author: 'Ankit Dutta', content: 'changed priority from No priority to High', type: 'UPDATE' },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Design Homepage',
      description: 'Redesign the primary marketing landing page for desktop and mobile devices.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: '12 Sep 2026',
      labels: JSON.stringify(['Design', 'Research']),
      members: JSON.stringify(['Ankit Sharma']),
      reporter: 'Dexter',
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Develop Login Feature',
      description: 'Implement Google SSO and Guest user authentication state in frontend.',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: '15 Sep 2026',
      labels: JSON.stringify(['Development', 'Testing']),
      members: JSON.stringify(['Dexter']),
      reporter: 'Ankit Dutta',
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Test Payment Gateway',
      description: 'Run end-to-end integration tests for Stripe sandbox checkout flow.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: '18 Sep 2026',
      labels: JSON.stringify(['Testing', 'Deployment']),
      members: JSON.stringify(['Abhishek Yadav']),
      reporter: 'Dexter',
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Feature Testing Process',
      description: 'Execute automated regression test suite on staging environment.',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: '10 Sep 2026',
      labels: JSON.stringify(['Testing']),
      members: JSON.stringify(['Ankit Dutta']),
      reporter: 'Ankit Dutta',
    },
  });

  console.log(`Seeded ${[task1, task2, task3, task4, task5].length} tasks successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

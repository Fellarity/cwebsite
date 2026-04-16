import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runLoadTest() {
    console.log("--- ⚡ Starting Load Test: Concurrent Database Queries ---");
    const startTime = Date.now();
    const concurrentRequests = 50;

    try {
        const tasks = Array.from({ length: concurrentRequests }).map((_, i) => 
            prisma.user.count().then(() => console.log(`Request ${i+1} completed`))
        );

        await Promise.all(tasks);
        
        const duration = Date.now() - startTime;
        console.log(`--- ✅ Results ---`);
        console.log(`Successful Requests: ${concurrentRequests}`);
        console.log(`Total Duration: ${duration}ms`);
        console.log(`Average Latency: ${duration / concurrentRequests}ms`);
    } catch (error) {
        console.error("❌ Load Test Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

runLoadTest();

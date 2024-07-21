// CREATING MICROSERVICES USING MOLECULER
//basic hello world
import { ServiceBroker } from "moleculer";

const broker = new ServiceBroker();

broker.createService({
    name: "greet",
    actions: {
        sayHello(ctx) {
            return `Hello ${ctx.params.name}!`;
        },
    },
});

async function startApp() {
    await broker.start();
    const res = await broker.call("greet.sayHello", { name: "shoaib" });
    console.log(res);
    broker.stop();
}

startApp();
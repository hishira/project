import { Application } from './application';

async function bootstrap() {
  await (await new Application().createApp())
    .enableCors()
    .createGlobalPipes([])
    .listenOnPort();
}
void bootstrap();

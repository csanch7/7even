import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { VenueEventSchema } from '../modules/recommendations/schemas/venue-event.schema';

async function seed() {
  const config = new ConfigService(process.env);
  await mongoose.connect(config.getOrThrow<string>('MONGODB_URI'));

  const VenueEventModel = mongoose.model('VenueEvent', VenueEventSchema, 'venues_events_catalog');
  const seedPath = path.resolve(__dirname, './venues.seed.json');
  const data = JSON.parse(await readFile(seedPath, 'utf8')) as Array<Record<string, unknown>>;

  await VenueEventModel.deleteMany({});
  await VenueEventModel.insertMany(data);
  await mongoose.disconnect();
  // eslint-disable-next-line no-console
  console.log(`Seeded ${data.length} venues/events`);
}

void seed();

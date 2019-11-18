import { EventEmitter } from "@borodindmitriy/isomorphic";

export enum events {
  SYNCED = "SYNCED",
}

export const pubSub = new EventEmitter();

import { AppError } from "../../utils/AppError";
import { eventRepository } from "./event.repository";
import type { createEventSchemaType } from './event.schema';


const CreateEventServiceFunction = async (payload: createEventSchemaType, userId:number) => { 
    const result = await eventRepository.createEvent(payload, userId);
    if (!result) {
        throw new AppError("event creation failed",500);
    }
    return result;
}


export const eventService = {
    CreateEventServiceFunction
}
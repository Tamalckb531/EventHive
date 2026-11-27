import { AppError } from "../../utils/AppError";
import { eventRepository } from "./event.repository";
import type { createEventSchemaType, updateEventSchemaType } from './event.schema';


const CreateEventServiceFunction = async (payload: createEventSchemaType, userId:number) => { 
    const result = await eventRepository.createEvent(payload, userId);
    if (!result) {
        throw new AppError("event creation failed",500);
    }
    return result;
}

const GetEventServiceFunction = async (search:string|undefined) => { 
    const result = await eventRepository.getEvent(search);
    return result;
}

const GetOneEventServiceFunction = async (id:number) => { 
    const result = await eventRepository.getOneEvent(id);
    if (!result) {
        throw new AppError("Event not found", 404);
    }
    return result;
}

const UpdateEventServiceFunction = async (
  id: number,
  payload: updateEventSchemaType,
  userId: number
) => {
  const result = await eventRepository.updateEvent(id, payload, userId);
  return result;
};


export const eventService = {
    CreateEventServiceFunction,
    GetEventServiceFunction,
    GetOneEventServiceFunction,
    UpdateEventServiceFunction
}
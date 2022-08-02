import Joi from "joi";

export const NotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().required()
})
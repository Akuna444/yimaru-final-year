import { z } from "zod";

export const SendMessageValidator = z.object({
  attachmentId: z.string(),
  message: z.string(),
});

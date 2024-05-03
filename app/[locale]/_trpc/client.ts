import { AppRouter } from "@/trpc";
import { createTRPCReact } from "@trpc/react-query";
console.log("this is trcp client");
export const trpc = createTRPCReact<AppRouter>({});
console.log(trpc, "this istrc");

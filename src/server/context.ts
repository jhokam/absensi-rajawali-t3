import * as trpcNext from "@trpc/server/adapters/next";
import { verify } from "argon2";

export async function createContext({
	req,
	res,
}: trpcNext.CreateNextContextOptions) {
	async function getUserFromHeader() {
		if (req.headers.authorization) {
			const user = await verify(req.headers.authorization, "");
			return user;
		}
		return null;
	}
	const user = await getUserFromHeader();

	return {
		user,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

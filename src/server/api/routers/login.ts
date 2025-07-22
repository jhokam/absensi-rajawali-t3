import { TRPCError } from "@trpc/server";
import { verify } from "argon2";
import { formatResponse } from "@/helper/response.helper";
import { loginSchema } from "@/types/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const loginRouter = createTRPCRouter({
	login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
		// const session = await ctx.db.loginToken.create({
		// 	data: {
		// 		user: {
		// 			connect: {
		// 				username: input.username,
		// 			},
		// 		},
		// 		token: input.password,
		// 	},
		// });
		const user = await ctx.db.user.findUnique({
			where: {
				username: input.username,
			},
		});
		if (!user || !(await verify(user.password, input.password))) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "User tidak ditemukan",
			});
		}

		return formatResponse(
			true,
			"Login berhasil",
			{
				items: { access_token: "token" },
				meta: { limit: 1, page: 1, total: 1, totalPages: 1 },
			},
			null,
		);
	}),
});

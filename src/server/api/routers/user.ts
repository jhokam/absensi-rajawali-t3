import type { UserWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { userFilter } from "@/types/user";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data User",
			{
				items: user,
				meta: {
					limit: user.length,
					page: 1,
					total: user.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(userFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: UserWhereInput = {
				AND: [
					{
						role: {
							equals: input.role,
						},
					},
					{
						username: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.user.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.user.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data User",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),
});

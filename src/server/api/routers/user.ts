import type { UserWhereInput } from "@/generated/client/models";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	userCreateSchema,
	userDeleteSchema,
	userFilter,
	userUpdateSchema,
} from "@/types/user";
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

	createUser: publicProcedure
		.input(userCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.create({
				data: {
					username: input.username,
					password: input.password,
					role: input.role,
				},
			});

			return formatResponse(true, "Berhasil menambahkan data User", user, null);
		}),

	updateUser: publicProcedure
		.input(userUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.update({
				where: {
					id: input.id,
				},
				data: {
					username: input.username,
					password: input.password,
					role: input.role,
				},
			});

			return formatResponse(true, "Berhasil mengubah data User", user, null);
		}),

	deleteUser: publicProcedure
		.input(userDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(true, "Berhasil menghapus data User", user, null);
		}),
});

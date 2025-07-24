import type { LogWhereInput } from "@/generated/client/models";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	logCreateSchema,
	logDeleteSchema,
	logFilter,
	logUpdateSchema,
} from "@/types/log";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const logRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const log = await ctx.db.log.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Log",
			{
				items: log,
				meta: {
					limit: log.length,
					page: 1,
					total: log.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(logFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: LogWhereInput = {
				AND: [
					{
						event: {
							contains: input.q,
							mode: "insensitive",
						},
					},
					{
						description: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.log.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.log.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Log",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),

	createLog: publicProcedure
		.input(logCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const log = await ctx.db.log.create({
				data: {
					event: input.event,
					description: input.description,
					user_id: input.user_id,
				},
			});

			return formatResponse(true, "Berhasil menambahkan data Log", log, null);
		}),

	updateLog: publicProcedure
		.input(logUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const log = await ctx.db.log.update({
				where: {
					id: input.id,
				},
				data: {
					event: input.event,
					description: input.description,
					user_id: input.user_id,
				},
			});

			return formatResponse(true, "Berhasil mengubah data Log", log, null);
		}),

	deleteLog: publicProcedure
		.input(logDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const log = await ctx.db.log.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(true, "Berhasil menghapus data Log", log, null);
		}),
});

import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	presenceCreateSchema,
	presenceDeleteSchema,
	presenceFilter,
	presenceUpdateSchema,
} from "@/types/presence";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const presenceRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const presence = await ctx.db.presence.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Presensi",
			{
				items: presence,
				meta: {
					limit: presence.length,
					page: 1,
					total: presence.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(presenceFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;

			const [data, total] = await ctx.db.$transaction([
				ctx.db.presence.findMany({
					skip: page * limit,
					take: limit,
				}),
				ctx.db.presence.count(),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Presensi",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),

	createPresence: publicProcedure
		.input(presenceCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const presence = await ctx.db.presence.create({
				data: {
					event_id: input.event_id,
					generus_id: input.generus_id,
					status: input.status,
				},
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Presensi",
				presence,
				null,
			);
		}),

	updatePresence: publicProcedure
		.input(presenceUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const presence = await ctx.db.presence.update({
				where: {
					id: input.id,
				},
				data: {
					event_id: input.event_id,
					generus_id: input.generus_id,
					status: input.status,
				},
			});

			return formatResponse(
				true,
				"Berhasil mengubah data Presensi",
				presence,
				null,
			);
		}),

	deletePresence: publicProcedure
		.input(presenceDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const presence = await ctx.db.presence.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(
				true,
				"Berhasil menghapus data Presensi",
				presence,
				null,
			);
		}),
});

import type { KelompokWhereInput } from "@/generated/client/models";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	kelompokCreateSchema,
	kelompokDeleteSchema,
	kelompokFilter,
	kelompokUpdateSchema,
} from "@/types/kelompok";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const kelompokRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const kelompok = await ctx.db.kelompok.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Kelompok",
			{
				items: kelompok,
				meta: {
					limit: kelompok.length,
					page: 1,
					total: kelompok.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(kelompokFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: KelompokWhereInput = {
				AND: [
					{
						desa_id: {
							equals: input.desa_id,
						},
					},
					{
						nama: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.kelompok.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.kelompok.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Kelompok",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),

	createKelompok: publicProcedure
		.input(kelompokCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const kelompok = await ctx.db.kelompok.create({
				data: {
					id: input.id,
					nama: input.nama,
					desa_id: input.desa_id,
				},
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Kelompok",
				kelompok,
				null,
			);
		}),

	updateKelompok: publicProcedure
		.input(kelompokUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const kelompok = await ctx.db.kelompok.update({
				where: {
					id: input.id,
				},
				data: {
					nama: input.nama,
					desa_id: input.desa_id,
				},
			});

			return formatResponse(
				true,
				"Berhasil mengubah data Kelompok",
				kelompok,
				null,
			);
		}),

	deleteKelompok: publicProcedure
		.input(kelompokDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const kelompok = await ctx.db.kelompok.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(
				true,
				"Berhasil menghapus data Kelompok",
				kelompok,
				null,
			);
		}),
});

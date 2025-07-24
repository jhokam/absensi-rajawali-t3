import type { DesaWhereInput } from "@/generated/client/models";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	desaCreateSchema,
	desaDeleteSchema,
	desaFilter,
	desaUpdateSchema,
} from "@/types/desa";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const desaRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const desa = await ctx.db.desa.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Desa",
			{
				items: desa,
				meta: {
					limit: desa.length,
					page: 1,
					total: desa.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(desaFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit;
			const page = input.page;
			const where: DesaWhereInput = {
				AND: [
					{
						nama: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.desa.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.desa.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Desa",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),

	createDesa: publicProcedure
		.input(desaCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const desa = await ctx.db.desa.create({
				data: {
					nama: input.nama,
				},
			});

			return formatResponse(true, "Berhasil menambahkan data Desa", desa, null);
		}),

	updateDesa: publicProcedure
		.input(desaUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const desa = await ctx.db.desa.update({
				where: {
					id: input.id,
				},
				data: {
					nama: input.nama,
				},
			});

			return formatResponse(true, "Berhasil mengubah data Desa", desa, null);
		}),

	deleteDesa: publicProcedure
		.input(desaDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const desa = await ctx.db.desa.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(true, "Berhasil menghapus data Desa", desa, null);
		}),
});

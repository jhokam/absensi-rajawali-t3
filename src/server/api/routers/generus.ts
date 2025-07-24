import type { GenerusWhereInput } from "@/generated/client/models";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	generusCreateSchema,
	generusDeleteSchema,
	generusFilter,
	generusUpdateSchema,
} from "@/types/generus";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const generusRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const generus = await ctx.db.generus.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Generus",
			{
				items: generus,
				meta: {
					limit: generus.length,
					page: 1,
					total: generus.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(generusFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: GenerusWhereInput = {
				AND: [
					{
						nama: {
							contains: input.q,
							mode: "insensitive",
						},
					},
					{
						jenis_kelamin: {
							equals: input.jenis_kelamin,
						},
					},
					{
						jenjang: {
							equals: input.jenjang,
						},
					},
					{
						pendidikan_terakhir: {
							equals: input.pendidikan_terakhir,
						},
					},
					{
						sambung: {
							equals: input.sambung,
						},
					},
					{
						keterangan: {
							equals: input.keterangan,
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.generus.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.generus.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Generus",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),

	createGenerus: publicProcedure
		.input(generusCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const generus = await ctx.db.generus.create({
				data: input,
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Generus",
				generus,
				null,
			);
		}),

	updateGenerus: publicProcedure
		.input(generusUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const generus = await ctx.db.generus.update({
				where: {
					id: input.id,
				},
				data: input,
			});

			return formatResponse(
				true,
				"Berhasil mengubah data Generus",
				generus,
				null,
			);
		}),

	deleteGenerus: publicProcedure
		.input(generusDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const generus = await ctx.db.generus.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(
				true,
				"Berhasil menghapus data Generus",
				generus,
				null,
			);
		}),
});
